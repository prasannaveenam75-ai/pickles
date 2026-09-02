import mongoose, { Schema, Document } from "mongoose";

export interface IComboItem {
  product: mongoose.Types.ObjectId;
  productName: string;
  variantName: string;
  quantity: number;
}

export interface IComboDoc extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  products: IComboItem[];
  comboPrice: number;
  originalPrice: number;
  discount: number;
  stock: number;
  active: boolean;
  featured: boolean;
  tags: string[];
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ComboItemSchema = new Schema({
  product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  productName: { type: String, required: true },
  variantName: { type: String, required: true },
  quantity: { type: Number, default: 1 },
});

const ComboSchema = new Schema<IComboDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    products: [ComboItemSchema],
    comboPrice: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, default: 0 },
    stock: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
    tags: [{ type: String }],
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

ComboSchema.index({ active: 1 });
ComboSchema.index({ featured: 1 });

export default mongoose.models.Combo || mongoose.model<IComboDoc>("Combo", ComboSchema);
