const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema(
  {
    senderEmail: { 
      type: String,  
      required: true 
    },
    body: { 
      type: String,   
      required: true 
    }
  },
  { timestamps: true }  
);


const chatSchema = new mongoose.Schema(
  {
    email: { 
      type: [String],   
    },
    messages: [messageSchema]  
  },
  { timestamps: true }  
);

chatSchema.index({ sender: 1, receiver: 1 }, { unique: true });

module.exports = mongoose.model("Chat", chatSchema);