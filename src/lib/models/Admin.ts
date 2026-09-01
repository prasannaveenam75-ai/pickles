import mongoose, { Schema, Document } from "mongoose";

export interface IAdminDoc extends Document {
  email: string;
  name: string;
  password: string;
  role: "admin" | "superadmin";
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdminDoc>(
  {
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    name: { type: String, required: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "superadmin"], default: "admin" },
  },
  { timestamps: true }
);

export default mongoose.models.Admin || mongoose.model<IAdminDoc>("Admin", AdminSchema);
