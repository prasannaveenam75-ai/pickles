import mongoose, { Schema, Document } from "mongoose";

export interface IOrderItemDoc {
  product: mongoose.Types.ObjectId;
  productName: string;
  variantId: mongoose.Types.ObjectId;
  variantName: string;
  weightInGrams: number;
  quantity: number;
  price: number;
  weight: string;
}

export interface IOrderDoc extends Document {
  orderNumber: string;
  customer: {
    name: string;
    phone: string;
    email: string;
  };
  items: IOrderItemDoc[];
  shippingAddress: {
    fullName: string;
    phone: string;
    email: string;
    houseFlat: string;
    street: string;
    area: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
  };
  paymentMethod: "razorpay" | "whatsapp";
  paymentStatus: "PENDING" | "PAID" | "FAILED" | "REFUNDED";
  orderStatus:
    | "PENDING"
    | "CONFIRMED"
    | "PROCESSING"
    | "PACKED"
    | "SHIPPED"
    | "OUT_FOR_DELIVERY"
    | "DELIVERED"
    | "CANCELLED";
  subtotal: number;
  deliveryCharge: number;
  totalWeight: number;
  grandTotal: number;
  couponCode?: string;
  discountAmount?: number;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  notes?: string;
  statusHistory: { status: string; timestamp: Date; note?: string }[];
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrderDoc>(
  {
    orderNumber: { type: String, required: true, unique: true },
    customer: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
    },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        productName: { type: String, required: true },
        variantId: { type: Schema.Types.ObjectId, required: true },
        variantName: { type: String, required: true },
        weightInGrams: { type: Number, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        weight: { type: String, required: true },
      },
    ],
    shippingAddress: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      email: { type: String, required: true },
      houseFlat: { type: String, required: true },
      street: { type: String, required: true },
      area: { type: String, default: "" },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true },
      country: { type: String, default: "India" },
    },
    paymentMethod: { type: String, enum: ["razorpay", "whatsapp"], required: true },
    paymentStatus: { type: String, enum: ["PENDING", "PAID", "FAILED", "REFUNDED"], default: "PENDING" },
    orderStatus: {
      type: String,
      enum: ["PENDING", "CONFIRMED", "PROCESSING", "PACKED", "SHIPPED", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
      default: "PENDING",
    },
    subtotal: { type: Number, required: true },
    deliveryCharge: { type: Number, required: true },
    totalWeight: { type: Number, required: true },
    grandTotal: { type: Number, required: true },
    couponCode: { type: String },
    discountAmount: { type: Number, default: 0 },
    razorpayOrderId: { type: String },
    razorpayPaymentId: { type: String },
    razorpaySignature: { type: String },
    notes: { type: String },
    statusHistory: [
      {
        status: { type: String, required: true },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],
  },
  { timestamps: true }
);

OrderSchema.index({ "customer.phone": 1 });
OrderSchema.index({ createdAt: -1 });
OrderSchema.index({ orderStatus: 1 });

export default mongoose.models.Order || mongoose.model<IOrderDoc>("Order", OrderSchema);
