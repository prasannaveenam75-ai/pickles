import mongoose, { Schema, Document } from "mongoose";

export interface IVariantDoc {
  name: string;
  weight: string;
  weightInGrams: number;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku?: string;
  active: boolean;
}

export interface IProductDoc extends Document {
  name: string;
  slug: string;
  category: string;
  subcategory?: string;
  description: string;
  shortDescription: string;
  images: string[];
  cloudinaryPublicIds: string[];
  variants: IVariantDoc[];
  ingredients: string[];
  tags: string[];
  featured: boolean;
  bestSeller: boolean;
  active: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema({
  name: { type: String, required: true },
  weight: { type: String, required: true },
  weightInGrams: { type: Number, required: true },
  price: { type: Number, required: true },
  compareAtPrice: { type: Number },
  stock: { type: Number, default: 0 },
  sku: { type: String },
  active: { type: Boolean, default: true },
});

const ProductSchema = new Schema<IProductDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    category: { type: String, required: true, trim: true },
    subcategory: { type: String },
    description: { type: String, default: "" },
    shortDescription: { type: String, default: "" },
    images: [{ type: String }],
    cloudinaryPublicIds: [{ type: String }],
    variants: [VariantSchema],
    ingredients: [{ type: String }],
    tags: [{ type: String }],
    featured: { type: Boolean, default: false },
    bestSeller: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

ProductSchema.index({ category: 1 });
ProductSchema.index({ featured: 1 });
ProductSchema.index({ bestSeller: 1 });
ProductSchema.index({ active: 1 });
ProductSchema.index({ name: "text", description: "text", tags: "text" });

export default mongoose.models.Product || mongoose.model<IProductDoc>("Product", ProductSchema);
