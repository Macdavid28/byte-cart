import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Admin } from "../models/admin.model.js";
import {
  initializeTransaction,
  verifyTransaction,
} from "../services/paystack.services.js";
import {
  sendOrderConfirmationEmail,
  sendShippingUpdateEmail,
} from "../email/email.js";
import crypto from "crypto";

// create order from cart and initialize payment
export const createOrder = async (req, res) => {
  const userId = req.userId;
  const { shipping } = req.body;
  try {
    // validate shipping info
    if (
      !shipping ||
      !shipping.fullName ||
      !shipping.phone ||
      !shipping.address
    ) {
      return res.status(400).json({
        success: false,
        message: "Shipping information (fullName, phone, address) is required",
      });
    }

    // find user
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // find user cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart || cart.items.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Cart is empty" });
    }

    // validate stock availability for each item
    for (const cartItem of cart.items) {
      const product = await Product.findById(cartItem.product);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product ${cartItem.name} no longer exists`,
        });
      }
      if (product.stock < cartItem.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}`,
        });
      }
    }

    // build order items from cart items
    const orderItems = cart.items.map((item) => ({
      productId: item.product,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }));

    // calculate pricing
    const subtotal = cart.subtotal;
    const discount = cart.discount || 0;
    const shippingFee = shipping.deliveryMethod === "express" ? 3000 : 1500;
    const tax = 0;
    const total = subtotal - discount + shippingFee + tax;

    // create order
    const order = new Order({
      user: userId,
      items: orderItems,
      pricing: {
        subtotal,
        shippingFee,
        discount,
        tax,
        total,
      },
      shipping: {
        fullName: shipping.fullName,
        phone: shipping.phone,
        address: shipping.address,
        city: shipping.city || "",
        state: shipping.state || "",
        country: shipping.country || "Nigeria",
        zone: shipping.zone || "",
        deliveryMethod: shipping.deliveryMethod || "standard",
      },
      payment: {
        method: "card",
        provider: "paystack",
        status: "pending",
      },
      status: "pending",
    });

    await order.save();

    // initialize paystack transaction (amount in kobo)
    const amountInKobo = Math.round(total * 100);
    const callbackUrl = `${process.env.CLIENT_LINK}/payment/verify`;

    const paystackResponse = await initializeTransaction(
      user.email,
      amountInKobo,
      {
        order_id: order._id.toString(),
        order_number: order.orderNumber,
      },
      callbackUrl,
    );

    // store paystack reference on order
    order.payment.reference = paystackResponse.data.reference;
    await order.save();

    return res.status(201).json({
      success: true,
      message: "Order created, proceed to payment",
      order: order,
      payment: {
        authorization_url: paystackResponse.data.authorization_url,
        access_code: paystackResponse.data.access_code,
        reference: paystackResponse.data.reference,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// verify payment and finalize order
export const verifyPayment = async (req, res) => {
  const { reference } = req.query;
  try {
    if (!reference) {
      return res.status(400).json({
        success: false,
        message: "Payment reference is required",
      });
    }

    // verify with paystack
    const verification = await verifyTransaction(reference);

    if (!verification.status || verification.data.status !== "success") {
      // update order payment status to failed
      const failedOrder = await Order.findOne({
        "payment.reference": reference,
      });
      if (failedOrder) {
        failedOrder.payment.status = "failed";
        failedOrder.status = "cancelled";
        await failedOrder.save();
      }
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // find the order by paystack reference
    const order = await Order.findOne({ "payment.reference": reference });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    // prevent double processing
    if (order.payment.status === "success") {
      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order,
      });
    }

    // update order payment info
    order.payment.status = "success";
    order.payment.paidAt = new Date();
    order.status = "paid";
    await order.save();

    // deduct stock for each ordered item
    for (const item of order.items) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    // clear user cart after successful payment
    await Cart.findOneAndDelete({ user: order.user });

    // send order confirmation email
    const user = await User.findById(order.user);
    if (user) {
      try {
        await sendOrderConfirmationEmail(
          user.email,
          user.name,
          order.orderNumber,
          order.pricing.total,
        );
      } catch (emailError) {
        // log but do not fail the order
        console.error("Order confirmation email failed:", emailError.message);
      }
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and order confirmed",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// paystack webhook handler
export const paystackWebhook = async (req, res) => {
  try {
    // verify webhook signature
    const hash = crypto
      .createHmac("sha512", process.env.PAYSTACK_SECRET_KEY)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (hash !== req.headers["x-paystack-signature"]) {
      return res.status(401).json({ success: false, message: "Invalid signature" });
    }

    const event = req.body;

    // handle charge.success event
    if (event.event === "charge.success") {
      const reference = event.data.reference;

      const order = await Order.findOne({ "payment.reference": reference });
      if (!order) {
        return res.sendStatus(200); // acknowledge even if order not found
      }

      // prevent double processing
      if (order.payment.status === "success") {
        return res.sendStatus(200);
      }

      // update order
      order.payment.status = "success";
      order.payment.paidAt = new Date();
      order.status = "paid";
      await order.save();

      // deduct stock
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.productId, {
          $inc: { stock: -item.quantity },
        });
      }

      // clear cart
      await Cart.findOneAndDelete({ user: order.user });

      // send confirmation email
      const user = await User.findById(order.user);
      if (user) {
        try {
          await sendOrderConfirmationEmail(
            user.email,
            user.name,
            order.orderNumber,
            order.pricing.total,
          );
        } catch (emailError) {
          console.error("Webhook email failed:", emailError.message);
        }
      }
    }

    // always respond 200 to acknowledge webhook
    return res.sendStatus(200);
  } catch (error) {
    console.error("Webhook error:", error.message);
    return res.sendStatus(200);
  }
};

// get all orders for the logged-in user
export const getMyOrders = async (req, res) => {
  const userId = req.userId;
  try {
    const orders = await Order.find({ user: userId }).sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// get a single order by id for the logged-in user
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  const userId = req.userId;
  try {
    const order = await Order.findOne({ _id: id, user: userId });
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }
    return res.status(200).json({ success: true, order });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// admin: get all orders
export const getAllOrders = async (req, res) => {
  const adminId = req.adminId;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }
    const orders = await Order.find({})
      .populate("user", "name email")
      .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// admin: update order status
export const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const adminId = req.adminId;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const validStatuses = [
      "pending",
      "paid",
      "processing",
      "shipped",
      "delivered",
      "cancelled",
      "refunded",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Valid options: ${validStatuses.join(", ")}`,
      });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    order.status = status;

    // set tracking timestamps
    if (status === "shipped") {
      order.tracking.shippedAt = new Date();
    }
    if (status === "delivered") {
      order.tracking.deliveredAt = new Date();
    }

    await order.save();

    // send shipping update email when order ships
    if (status === "shipped") {
      const user = await User.findById(order.user);
      if (user) {
        try {
          await sendShippingUpdateEmail(
            user.email,
            user.name,
            order.orderNumber,
            order.tracking.trackingNumber || "N/A",
          );
        } catch (emailError) {
          console.error("Shipping update email failed:", emailError.message);
        }
      }
    }

    return res.status(200).json({
      success: true,
      message: `Order status updated to ${status}`,
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// admin: update tracking info
export const updateTracking = async (req, res) => {
  const { id } = req.params;
  const { courier, trackingNumber } = req.body;
  const adminId = req.adminId;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res
        .status(404)
        .json({ success: false, message: "Order not found" });
    }

    if (courier !== undefined) order.tracking.courier = courier;
    if (trackingNumber !== undefined)
      order.tracking.trackingNumber = trackingNumber;

    await order.save();

    return res.status(200).json({
      success: true,
      message: "Tracking information updated",
      order,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
