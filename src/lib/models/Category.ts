import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDoc extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  cloudinaryPublicId?: string;
  displayOrder: number;
  active: boolean;
  seoTitle?: string;
  seoDescription?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    cloudinaryPublicId: { type: String },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

CategorySchema.index({ displayOrder: 1 });

export default mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", CategorySchema);
