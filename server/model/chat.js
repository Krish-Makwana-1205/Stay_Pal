const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderEmail: { type: String, required: true },
    body: { type: String, required: true }
  },
  { timestamps: true }
);

const chatSchema = new mongoose.Schema(
  {
    chatId: { type: String, required: true, unique: true }, // UNIQUE KEY
    email: { type: [String], required: true },               // BOTH EMAILS
    messages: [messageSchema]
  },
  { timestamps: true }
);

// No unique index on email array
module.exports = mongoose.model("Chat", chatSchema);
