const { get } = require('http');
const Chat = require('../model/chat');

async function postMessage(req, res) {
  try {
    const sender = req.user.email;
    const receiver = req.body.email;
    if (!receiver) {
      return res.status(400).json({ success: false, message: "Receiver email required" });
    }
    if (!req.body.message) {
      return res.status(400).json({ success: false, message: "Message required" });
    }

    const cleanReceiver = receiver.trim().toLowerCase();
    const emails = [sender, cleanReceiver].sort();
    const chatId = emails.join("-");

    const updatedChat = await Chat.findOneAndUpdate(
      { chatId },   
      {
        $setOnInsert: { chatId, email: emails },
        $push: {
          messages: {
            senderEmail: sender,
            body: req.body.message
          }
        }
      },
      { upsert: true, new: true }
    );

    res.status(200).json({ success: true, data: updatedChat });

  } catch (error) {
    console.log("POST MESSAGE ERROR:", error);
    res.status(500).json({ success: false, error });
  }
}


async function getChat(req, res) {
    try {
        const sender = req.user.email;
        const receiver = req.query.email;

        if (!receiver) {
            return res.status(400).json({ success: false, message: "Receiver email required" });
        }

        const emails = [sender, receiver].sort();
        const chatId = emails.join("-");

        const chat = await Chat.findOne({ chatId });

        res.status(200).json({ success: true, data: chat });

    } catch (error) {
        console.log("GET CHAT ERROR:", error);
        res.status(500).json({ success: false, error });
    }
}

// KEEP createChat if you want manual chat creation
async function getChatList(req, res) {
    try {
        const email = req.user.email;

        const chats = await Chat.find({ email: email });

        res.status(200).json({
            success: true,
            data: chats
        });

    } catch (error) {
        console.log("🔥 CHAT LIST ERROR:", error);
        res.status(500).json({ success: false, error });
    }
}



module.exports = {
    getChat,
    postMessage,
    getChatList
};
