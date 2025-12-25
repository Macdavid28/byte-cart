import express from "express";
import {
  createCoupon,
  getAllCoupons,
} from "../controllers/coupon.controller.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
export const couponRoutes = express.Router();
couponRoutes.post("/create", authMiddleware, isAdmin, createCoupon);
couponRoutes.get("/all", getAllCoupons);
