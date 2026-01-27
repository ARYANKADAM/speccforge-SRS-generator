import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  sectionId: { type: String, required: true }, // Unique ID for SRS section
  documentId: { type: mongoose.Schema.Types.ObjectId, ref: "SRSForm", required: true }, // Link to parent document
  user: {
    _id: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    email: String
  },
  text: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.models.Comment || mongoose.model("Comment", CommentSchema);
