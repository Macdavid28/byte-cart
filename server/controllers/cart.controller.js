import Cart from "../models/cart.model.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";
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
    if (!userID) {
      return res.status(403).json({
        success: false,
        message: "Admins cannot create a cart. Please log in as a user.",
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
      cart = await Cart.create({ user: userID, items: [] });
    }
    const existingCartItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId,
    );

    if (existingCartItemIndex !== -1) {
      const existingCartItem = cart.items[existingCartItemIndex];
      existingCartItem.quantity += quantity;
      existingCartItem.subtotal =
        existingCartItem.price * existingCartItem.quantity;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        price: product.price,
        quantity,
        subtotal: product.price * quantity,
      });
    }

    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal - (cart.discount || 0);

    await cart.save();
    return res.status(200).json({
      success: true,
      message: "Product added to cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const applyCouponToCart = async (req, res) => {
  const { code } = req.body;
  try {
    const cart = await Cart.findOne({ user: req.userId });
    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "cart not found" });
    }
    
    let coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, message: "coupon not found" });
    }

    coupon = await evaluateCouponState(coupon);

    if (coupon.endDate && Date.now() > coupon.endDate.getTime()) {
      return res
        .status(400)
        .json({ success: false, message: "coupon is expired" });
    }
    if (coupon.startDate && Date.now() < coupon.startDate.getTime()) { // Changed coupon.startDate check
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
      
      cart.discount = cart.subtotal;
      cart.total = cart.subtotal - cart.discount;
    }
    
    coupon.usedCount += 1;
    await coupon.save(); 
    await cart.save();
    
    res.status(200).json({ success: true, message: "coupon applied to cart" });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
};


export const getAllCarts = async(req,res)=>{
  const adminId = req.adminId;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ success: false, message: "admin not found" });
    }
    const carts = await Cart.find({});
    return res.status(200).json({ success: true, carts });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message || "Internal Server Error",
    });
  }
}

export const getCartForUser = async (req, res) => {
  const userId = req.userId;
  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "cart not found" });
    }
    if (cart.items.length === 0) {
      return res.status(200).json({
        success: false,
        message: "cart empty start shopping",
      });
    }
  
    return res.status(200).json({ success: true, cart: cart});
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const deleteProductInCart = async (req, res) => {
  const { productId } = req.body;
  const userId = req.userId;

  try {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart",
      });
    }

    cart.items.splice(itemIndex, 1);

    cart.subtotal = cart.items.reduce((sum, item) => sum + item.subtotal, 0);
    cart.total = cart.subtotal - (cart.discount || 0);

    await cart.save();
    return res.status(200).json({
      success: true,
      message: "Product removed from cart",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
