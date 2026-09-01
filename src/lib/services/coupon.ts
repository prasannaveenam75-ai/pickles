import { connectToDatabase } from "@/lib/mongodb";
import { Coupon } from "@/lib/models";

interface CouponValidation {
  valid: boolean;
  message: string;
  discount?: number;
}

export async function validateCoupon(code: string, subtotal: number): Promise<CouponValidation> {
  await connectToDatabase();

  const coupon = await Coupon.findOne({ code: code.toUpperCase(), active: true }).lean();
  if (!coupon) {
    return { valid: false, message: "Invalid coupon code." };
  }

  const now = new Date();
  if (now < new Date(coupon.startDate)) {
    return { valid: false, message: "This coupon is not yet active." };
  }
  if (now > new Date(coupon.endDate)) {
    return { valid: false, message: "This coupon has expired." };
  }

  if (coupon.usageLimit > 0 && coupon.usedCount >= coupon.usageLimit) {
    return { valid: false, message: "This coupon has reached its usage limit." };
  }

  if (subtotal < coupon.minimumOrderValue) {
    return { valid: false, message: `Minimum order value of ₹${coupon.minimumOrderValue} required.` };
  }

  let discount = 0;
  if (coupon.discountType === "percentage") {
    discount = Math.round((subtotal * coupon.discountValue) / 100);
    if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
      discount = coupon.maximumDiscount;
    }
  } else {
    discount = coupon.discountValue;
  }

  return { valid: true, message: "Coupon applied successfully!", discount };
}
