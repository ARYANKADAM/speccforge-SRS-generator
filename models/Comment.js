import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    sectionId: { type: String, required: true },
    documentId: { type: mongoose.Schema.Types.ObjectId, ref: "SRSForm", required: true },
    user: {
      _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      name: String,
      email: String,
    },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

CommentSchema.index({ documentId: 1, sectionId: 1, createdAt: 1 });
CommentSchema.index({ "user._id": 1, createdAt: -1 });

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
