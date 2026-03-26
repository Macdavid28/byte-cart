import express from "express";
import {
  createReview,
  getProductReviews,
  updateReview,
  deleteReview,
  adminDeleteReview,
} from "../controllers/review.controller.js";
import { verifyToken } from "../middleware/verify-token.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

export const reviewRoutes = express.Router();

// user routes
reviewRoutes.post("/create", verifyToken, createReview);
reviewRoutes.get("/product/:productId", getProductReviews);
reviewRoutes.put("/:id", verifyToken, updateReview);
reviewRoutes.delete("/:id", verifyToken, deleteReview);

// admin route
reviewRoutes.delete("/admin/:id", authMiddleware, isAdmin, adminDeleteReview);
