import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, index: true },
  password: { type: String, required: true }, // hashed with bcrypt
}, { timestamps: true });

UserSchema.index({ email: 1 });

export default mongoose.models.User || mongoose.model("User", UserSchema);