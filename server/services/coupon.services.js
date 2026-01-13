export const evaluateCouponState = async (coupon) => {
  const now = new Date();
  let changed = false;

  if (coupon.expiresAt && coupon.expiresAt < now) {
    coupon.active = false;
    changed = true;
  }

  if (
    coupon.usageLimit &&
    coupon.usedCount >= coupon.usageLimit
  ) {
    coupon.active = false;
    changed = true;
  }

  if (changed) {
    await coupon.save();
  }

  return coupon;
};