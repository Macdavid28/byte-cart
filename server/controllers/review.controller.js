import { Review } from "../models/review.model.js";
import { Product } from "../models/product.model.js";
import { User } from "../models/user.model.js";
import { Admin } from "../models/admin.model.js";

// create a review for a product
export const createReview = async (req, res) => {
  const userId = req.userId;
  const { productId, rating, comment } = req.body;
  try {
    if (!productId || !rating || !comment) {
      return res.status(400).json({
        success: false,
        message: "productId, rating, and comment are required",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    // check if user already reviewed this product
    const existingReview = await Review.findOne({
      user: userId,
      product: productId,
    });
    if (existingReview) {
      return res.status(409).json({
        success: false,
        message: "You have already reviewed this product",
      });
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating,
      comment,
    });

    return res.status(201).json({
      success: true,
      message: "Review created successfully",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// get all reviews for a product
export const getProductReviews = async (req, res) => {
  const { productId } = req.params;
  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    const reviews = await Review.find({ product: productId })
      .populate("user", "name username displayPicture")
      .sort({ createdAt: -1 });

    // calculate average rating
    const totalRatings = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating =
      reviews.length > 0 ? (totalRatings / reviews.length).toFixed(1) : 0;

    return res.status(200).json({
      success: true,
      reviews,
      averageRating: Number(averageRating),
      totalReviews: reviews.length,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// update own review
export const updateReview = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  const { rating, comment } = req.body;
  try {
    const review = await Review.findOne({ _id: id, user: userId });
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    if (rating !== undefined) review.rating = rating;
    if (comment !== undefined) review.comment = comment;

    await review.save();

    return res.status(200).json({
      success: true,
      message: "Review updated",
      review,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// delete own review
export const deleteReview = async (req, res) => {
  const userId = req.userId;
  const { id } = req.params;
  try {
    const review = await Review.findOneAndDelete({ _id: id, user: userId });
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

// admin: delete any review
export const adminDeleteReview = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
  try {
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res
        .status(404)
        .json({ success: false, message: "Admin not found" });
    }

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return res
        .status(404)
        .json({ success: false, message: "Review not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Review deleted by admin",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
