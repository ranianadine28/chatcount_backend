import mongoose from "mongoose";
const { Schema, model } = mongoose;
const MessageSchema = new Schema({
  sender: { type: String },
  text: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const ConversationSchema = new Schema({
  messages: [MessageSchema], // Tableau de messages
  date: { type: Date, required: true },
  name: { type: String, required: true },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
    required: true,
  },
  fecId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Fec",
    required: true,
  },
});

export default mongoose.model("conversation", ConversationSchema);
