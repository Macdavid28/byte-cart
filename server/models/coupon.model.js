import mongoose from "mongoose";

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["percentage", "fixed", "free_shipping"],
    required: true,
  },
  value: {
    type: Number,
    required: true,
    min: 0,
  },

  usageLimit: { type: Number, max: 10 }, // total times coupon can be used
  userLimit: { type: Number, default: null }, // times a single user can use
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  usedCount: { type: Number, default: 0 },
});

export const Coupon = mongoose.model("Coupons", couponSchema);
