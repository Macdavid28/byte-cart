import { Coupon } from "../models/coupon.model.js";
export const createCoupon = async (req, res) => {
  try {
    const {
      code,
      type,
      discountPercentage,
      usageLimit,
      userLimit,
      startDate,
      endDate,
      active,
    } = req.body;
    const existingCoupon = await Coupon.findOne({ code });
    if (existingCoupon) {
      return res.status(409).json({
        success: false,
        message: "Coupon code already exists",
      });
    }
    const upperCase = code.toUpperCase();
    const coupon = await Coupon.create({
      code: upperCase,
      type,
      discountPercentage,
      usageLimit,
      userLimit,
      startDate,
      endDate,
      active,
      admin: req.adminId,
    });
    return res.status(201).json({ success: true, coupon });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
export const getAllCoupons = async (req, res) => {
  try {
    const admin = req.adminId;
    if (!admin) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const coupons = await Coupon.find({}).select("-admin");
    if (!coupons) {
      return res
        .status(404)
        .json({ success: false, message: "No coupons found" });
    }
    return res.status(200).json({ success: true, coupons });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal server error",
    });
  }
};
export const getCouponById = async (req, res) => {
  const { id } = req.params;
  try {
    const admin = req.adminId;
    if (!admin) {
      return res
        .status(401)
        .status({ success: false, message: "Unauthorized" });
    }
    const uniqueCoupon = await Coupon.findById(id);
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon Not Found",
      });
      return res.status(200).json({ success: true, details: uniqueCoupon });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const updateCoupon = async (req, res) => {};
export const deleteCoupon = async (req, res) => {};
