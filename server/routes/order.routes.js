import express from "express";
import {
  createOrder,
  verifyPayment,
  paystackWebhook,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
  updateTracking,
} from "../controllers/order.controller.js";
import { verifyToken } from "../middleware/verify-token.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

export const orderRoutes = express.Router();

// user routes
orderRoutes.post("/create", verifyToken, createOrder);
orderRoutes.get("/verify", verifyPayment);
orderRoutes.get("/my-orders", verifyToken, getMyOrders);
orderRoutes.get("/my-orders/:id", verifyToken, getOrderById);

// admin routes
orderRoutes.get("/admin/all", authMiddleware, isAdmin, getAllOrders);
orderRoutes.put("/admin/status/:id", authMiddleware, isAdmin, updateOrderStatus);
orderRoutes.put("/admin/tracking/:id", authMiddleware, isAdmin, updateTracking);

// paystack webhook (no auth - secured via signature verification)
orderRoutes.post("/webhook/paystack", paystackWebhook);
