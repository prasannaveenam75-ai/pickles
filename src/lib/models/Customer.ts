import mongoose, { Schema, Document } from "mongoose";

export interface ICustomerDoc extends Document {
  name: string;
  phone: string;
  email: string;
  totalOrders: number;
  totalSpent: number;
  createdAt: Date;
  updatedAt: Date;
}

const CustomerSchema = new Schema<ICustomerDoc>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    totalOrders: { type: Number, default: 0 },
    totalSpent: { type: Number, default: 0 },
  },
  { timestamps: true }
);

CustomerSchema.index({ phone: 1 });
CustomerSchema.index({ email: 1 });

export default mongoose.models.Customer || mongoose.model<ICustomerDoc>("Customer", CustomerSchema);
