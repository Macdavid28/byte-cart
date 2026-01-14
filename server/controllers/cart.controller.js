import Cart from "../models/cart.model.js";
import { User } from "../models/user.model.js";
import { Product } from "../models/product.model.js";

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
      (item) => item.product.toString() === productId
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
