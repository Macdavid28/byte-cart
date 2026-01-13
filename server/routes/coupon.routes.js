import express from "express";
import {
  createCoupon,
  getAllCoupons,
  getCouponById,
  updateCoupon,
  deleteCoupon,
  useCoupon
} from "../controllers/coupon.controller.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
export const couponRoutes = express.Router();
couponRoutes.post("/create", authMiddleware, isAdmin, createCoupon);
couponRoutes.post("/use", authMiddleware, useCoupon);
couponRoutes.get("/all", authMiddleware, isAdmin, getAllCoupons);
couponRoutes.get("/:id", authMiddleware, isAdmin, getCouponById);
couponRoutes.put("/:id", authMiddleware, isAdmin, updateCoupon);
couponRoutes.delete("/:id", authMiddleware, isAdmin, deleteCoupon);
