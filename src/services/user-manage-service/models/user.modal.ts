import mongoose, { Schema, Document, Model } from "mongoose";

export interface TagDocument extends Document {
  tags: string[];
}

const TagSchema = new Schema<TagDocument>(
  {
    tags: {
      type: [String],
      required: true,
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

export const TagModel: Model<TagDocument> =
  mongoose.models.Tag || mongoose.model<TagDocument>("Tag", TagSchema);
