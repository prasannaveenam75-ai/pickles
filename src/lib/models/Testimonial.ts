import mongoose, { Schema, Document } from "mongoose";

export type TestimonialType = "written" | "instagram" | "uploaded";

export interface ITestimonialDoc extends Document {
  type: TestimonialType;
  customerName: string;
  customerLocation: string;
  customerImage?: string;
  productId?: string;
  productName?: string;
  rating: number;
  reviewText: string;
  instagramUrl?: string;
  instagramCode?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  videoPublicId?: string;
  videoDuration?: number;
  videoAspect?: string;
  caption: string;
  verified: boolean;
  featured: boolean;
  active: boolean;
  displayOrder: number;
  isDemo: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonialDoc>(
  {
    type: { type: String, enum: ["written", "instagram", "uploaded"], required: true, default: "written" },
    customerName: { type: String, required: true, trim: true },
    customerLocation: { type: String, default: "" },
    customerImage: { type: String },
    productId: { type: String },
    productName: { type: String, default: "" },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    reviewText: { type: String, default: "" },
    instagramUrl: { type: String },
    instagramCode: { type: String },
    videoUrl: { type: String },
    thumbnailUrl: { type: String },
    videoPublicId: { type: String },
    videoDuration: { type: Number },
    videoAspect: { type: String },
    caption: { type: String, default: "" },
    verified: { type: Boolean, default: false },
    featured: { type: Boolean, default: false },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
    isDemo: { type: Boolean, default: false },
  },
  { timestamps: true }
);

TestimonialSchema.index({ type: 1, active: 1, featured: 1 });
TestimonialSchema.index({ productId: 1, active: 1 });
TestimonialSchema.index({ displayOrder: 1 });

export default mongoose.models.Testimonial || mongoose.model<ITestimonialDoc>("Testimonial", TestimonialSchema);