export const evaluateCouponState = async (coupon) => {
  const now = new Date();
  let changed = false;

  if (coupon.endDate && coupon.endDate < now) {
    coupon.active = false;
    changed = true;
  }

  if (coupon.startDate && coupon.startDate > now) {
    coupon.active = false;
    changed = true;
  }

  if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
    coupon.active = false;
    changed = true;
  }

  if (changed) {
    await coupon.save();
  }

  return coupon;
};
