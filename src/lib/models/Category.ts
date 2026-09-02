import mongoose, { Schema, Document } from "mongoose";

export interface ICategoryDoc extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  banner: string;
  cloudinaryPublicId?: string;
  parent?: mongoose.Types.ObjectId;
  displayOrder: number;
  active: boolean;
  seasonal: boolean;
  seasonalStart?: Date;
  seasonalEnd?: Date;
  startDate?: Date;
  endDate?: Date;
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
    banner: { type: String, default: "" },
    cloudinaryPublicId: { type: String },
    parent: { type: Schema.Types.ObjectId, ref: "Category", default: null },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
    seasonal: { type: Boolean, default: false },
    seasonalStart: { type: Date },
    seasonalEnd: { type: Date },
    startDate: { type: Date },
    endDate: { type: Date },
    seoTitle: { type: String },
    seoDescription: { type: String },
  },
  { timestamps: true }
);

CategorySchema.index({ displayOrder: 1 });
CategorySchema.index({ parent: 1 });
CategorySchema.index({ active: 1 });
CategorySchema.index({ seasonal: 1 });

export default mongoose.models.Category || mongoose.model<ICategoryDoc>("Category", CategorySchema);
