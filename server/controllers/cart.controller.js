import Cart from "../models/cart.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";
import { Coupon } from "../models/coupon.model.js";
import { evaluateCouponState } from "../services/coupon.services.js";

export const createCart = async (req, res) => {
  const userID = req.userId;
  const { productId, quantity } = req.body;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }
    const user = await User.findById(userID);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    let cart = await Cart.findOne({ user: userID });
    if (!cart) {
      const cart = await Cart.create({ user: userID, items: [] });
    }
    const existingCartItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );
    existingCartItem = cart.items[existingCartItemIndex];
    if (existingCartItem !== -1) {
      existingCartItem.quantity += quantity;
      existingCartItem.subtotal =
        existingCartItem.price * existingCartItem.quantity;
      cart.subtotal += existingCartItem.subtotal;
      cart.total = cart.subtotal - cart.discount;
      await cart.save();
      return res.status(200).json({
        success: true,
        message: "Product added to cart",
      });
    } else {
      cart.items.push({
        product: product._id,
        quantity,
        subtotal: product.price * quantity,
      });
    }
    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal - (cart.discount || 0);

    await cart.save();
  } catch (error) {}
};

export const applyCouponToCart = async (req, res) => {
  try {
    coupon = await evaluateCouponState(coupon);
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "cart not found" });
    }
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "coupon not found" });
    }
    if (Date.now() > coupon.endDate.getTime()) {
      return res
        .status(400)
        .json({ success: false, message: "coupon is expired" });
    }
    if (Date.now() < coupon.startDate.getTime()) {
      return res
        .status(400)
        .json({ success: false, message: "coupon is not active yet" });
    }
    if (coupon.active === false) {
      return res
        .status(400)
        .json({ success: false, message: "coupon is not active" });
    }
    if (coupon.type === "percentage") {
      cart.discount = (cart.subtotal * coupon.value) / 100;
      cart.total = cart.subtotal - cart.discount;
    }
    if (coupon.type === "fixed") {
      cart.discount = coupon.value;
      cart.total = cart.subtotal - cart.discount;
    }
    if (coupon.type === "free_shipping") {
      cart.discount = cart.subtotal;
      cart.total = cart.subtotal - cart.discount;
    }
  } catch (error) {}
};
