import mongoose, { Schema, Document } from "mongoose";

export interface ICouponDoc extends Document {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumOrderValue: number;
  maximumDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICouponDoc>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    discountType: { type: String, enum: ["percentage", "fixed"], required: true },
    discountValue: { type: Number, required: true },
    minimumOrderValue: { type: Number, default: 0 },
    maximumDiscount: { type: Number },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model<ICouponDoc>("Coupon", CouponSchema);
