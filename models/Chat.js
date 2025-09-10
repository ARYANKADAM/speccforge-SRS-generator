// models/Chat.js
import mongoose from 'mongoose';

const ChatSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  messages: [
    {
      role: { type: String, enum: ['user', 'bot'], required: true },
      content: { type: String, required: true },
      timestamp: { type: Date, default: Date.now }
    }
  ],
  model: { type: String, default: 'Gemma2B' }
}, { timestamps: true });

export default mongoose.models.Chat || mongoose.model('Chat', ChatSchema);