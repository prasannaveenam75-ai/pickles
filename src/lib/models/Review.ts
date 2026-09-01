import mongoose, { Schema, Document } from "mongoose";

export interface IReviewDoc extends Document {
  customerName: string;
  rating: number;
  review: string;
  location?: string;
  photo?: string;
  published: boolean;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReviewDoc>(
  {
    customerName: { type: String, required: true, trim: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    review: { type: String, required: true },
    location: { type: String },
    photo: { type: String },
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ReviewSchema.index({ published: 1 });
ReviewSchema.index({ featured: 1 });

export default mongoose.models.Review || mongoose.model<IReviewDoc>("Review", ReviewSchema);
