import { Coupon } from "../models/coupon.model.js";
import { User } from "../models/user.model.js";
import { evaluateCouponState } from "../services/coupon.services.js";
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
    if (!uniqueCoupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon Not Found",
      });
    }
    return res.status(200).json({ success: true, details: uniqueCoupon });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const updateCoupon = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
    try {
    const coupon = await Coupon.findByIdAndUpdate(id, { admin: adminId }).select("-admin");
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, coupon: coupon });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
export const deleteCoupon = async (req, res) => {
  const adminId = req.adminId;
  const { id } = req.params;
    try {
    const coupon = await Coupon.findByIdAndDelete(id, { admin: adminId }).select("-admin");
    if (!coupon) {
      return res.status(404).json({ success: false, message: "Not found" });
    }
    return res.status(200).json({ success: true, coupon: coupon });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const useCoupon = async (req, res) => {
  const { couponCode } = req.body;
  const userId = req.userId;
  try {
    if (!couponCode) {
      return res.status(400).json({
        success: false,
        message: "Coupon is required",
      });
    }

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await evaluateCouponState(coupon);

    if (!coupon.active) {
      return res.status(400).json({
        success: false,
        message: "Coupon is not active",
      });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId, coupons: { $ne: coupon._id } },
      { $push: { coupons: coupon._id } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({
        success: false,
        message: "User has already used this coupon",
      });
    }
const usedCoupon = await Coupon.findOneAndUpdate(
  {
    code: couponCode,
    active: true,
    $or: [
      { usageLimit: { $exists: false } },
      { $expr: { $lt: ["$usedCount", "$usageLimit"] } }
    ]
  },
  { $inc: { usedCount: 1 } },
  { new: true }
);

if (!usedCoupon) {
  return res.status(400).json({
    success: false,
    message: "Coupon usage limit exceeded"
  });
}

    return res.status(200).json({
      success: true,
      coupon: {
        code: usedCoupon.code,
        discount: usedCoupon.discount,
        type: usedCoupon.type,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};


