import mongoose from "mongoose";

const StorageConnectionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    provider: {
      type: String,
      enum: ["google", "onedrive"],
      required: true,
      index: true,
    },
    accessToken: { type: String, required: true },
    refreshToken: { type: String },
    expiresAt: { type: Date },
    accountEmail: { type: String, trim: true, lowercase: true },
  },
  { timestamps: true }
);

StorageConnectionSchema.index({ userId: 1, provider: 1 }, { unique: true });

export default mongoose.models.StorageConnection || mongoose.model("StorageConnection", StorageConnectionSchema);
