import mongoose, { Schema, Document } from "mongoose";

export interface ISiteSettingsDoc extends Document {
  businessName: string;
  businessAddress: string;
  phone: string;
  whatsappNumber: string;
  email: string;
  fssaiNumber: string;
  gstNumber?: string;
  logo: string;
  favicon: string;
  deliveryRatePerKg: number;
  minimumDeliveryCharge: number;
  freeDeliveryEnabled: boolean;
  freeDeliveryThreshold: number;
  razorpayEnabled: boolean;
  whatsappOrdersEnabled: boolean;
  updatedAt: Date;
}

const SiteSettingsSchema = new Schema<ISiteSettingsDoc>(
  {
    businessName: { type: String, default: "Devi Pickles" },
    businessAddress: { type: String, default: "" },
    phone: { type: String, default: "" },
    whatsappNumber: { type: String, default: "" },
    email: { type: String, default: "" },
    fssaiNumber: { type: String, default: "" },
    gstNumber: { type: String, default: "" },
    logo: { type: String, default: "" },
    favicon: { type: String, default: "" },
    deliveryRatePerKg: { type: Number, default: 100 },
    minimumDeliveryCharge: { type: Number, default: 100 },
    freeDeliveryEnabled: { type: Boolean, default: false },
    freeDeliveryThreshold: { type: Number, default: 0 },
    razorpayEnabled: { type: Boolean, default: true },
    whatsappOrdersEnabled: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.models.SiteSettings || mongoose.model<ISiteSettingsDoc>("SiteSettings", SiteSettingsSchema);
