import mongoose, { Schema, Document, Model } from "mongoose";

export interface UserDocument extends Document {
  name: string;
  email: string;
  role: "employee" | "admin";
  employeeId: string;
  profilePictureUrl?: string;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ["employee", "admin"], default: "employee" },
    employeeId: { type: String, required: true, unique: true },
    profilePictureUrl: { type: String },
  },
  { timestamps: true },
);

export const UserModel: Model<UserDocument> =
  mongoose.models.Tag || mongoose.model<UserDocument>("User", UserSchema);
