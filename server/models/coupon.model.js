const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true },
  type: {
    type: String,
    enum: ["percentage", "fixed", "free_shipping"],
    required: true,
  },
  value: { type: Number, required: true }, // % or fixed amount
  usageLimit: { type: Number, default: null }, // total times coupon can be used
  userLimit: { type: Number, default: null }, // times a single user can use
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Coupon = mongoose.model("Coupons", couponSchema);
