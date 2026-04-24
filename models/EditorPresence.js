import mongoose from "mongoose";

const EditorPresenceSchema = new mongoose.Schema(
  {
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SRSForm",
      required: true,
      index: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    userName: {
      type: String,
      required: true,
      trim: true,
    },
    section: {
      type: String,
      default: "general",
      trim: true,
    },
    lastSeenAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

EditorPresenceSchema.index({ documentId: 1, userId: 1 }, { unique: true });

export default mongoose.models.EditorPresence || mongoose.model("EditorPresence", EditorPresenceSchema);
