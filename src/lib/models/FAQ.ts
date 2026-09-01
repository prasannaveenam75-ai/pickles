import mongoose, { Schema, Document } from "mongoose";

export interface IFAQDoc extends Document {
  question: string;
  answer: string;
  displayOrder: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FAQSchema = new Schema<IFAQDoc>(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    displayOrder: { type: Number, default: 0 },
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FAQSchema.index({ displayOrder: 1 });
FAQSchema.index({ active: 1 });

export default mongoose.models.FAQ || mongoose.model<IFAQDoc>("FAQ", FAQSchema);
