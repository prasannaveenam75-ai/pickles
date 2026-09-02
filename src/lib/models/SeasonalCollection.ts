import mongoose, { Schema, Document } from "mongoose";

export interface ISeasonalCollectionDoc extends Document {
  name: string;
  slug: string;
  description: string;
  image: string;
  banner: string;
  categories: mongoose.Types.ObjectId[];
  products: mongoose.Types.ObjectId[];
  startDate?: Date;
  endDate?: Date;
  active: boolean;
  displayOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const SeasonalCollectionSchema = new Schema<ISeasonalCollectionDoc>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    banner: { type: String, default: "" },
    categories: [{ type: Schema.Types.ObjectId, ref: "Category" }],
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    startDate: { type: Date },
    endDate: { type: Date },
    active: { type: Boolean, default: true },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

SeasonalCollectionSchema.index({ active: 1 });
SeasonalCollectionSchema.index({ displayOrder: 1 });

export default mongoose.models.SeasonalCollection ||
  mongoose.model<ISeasonalCollectionDoc>("SeasonalCollection", SeasonalCollectionSchema);
