const Chat = require('../model/chat');

async function postMessage(req, res) {
    try {
        if(!req.body.email){
            return res.status(400).json({success:false, message:'Provide the receiver email'});
        }
        if(!req.body.message){
            return res.status(400).json({success:false, message:'Provide the message to be sent'});
        }
        req.body.email = req.body.trimEnd().toLowerCase();
        const chatemails = [req.user.email, req.body.email].sort();
        await Chat.findOneAndUpdate(
            { email: chatemails },
            {
                $setOnInsert: { email: chatemails },
                $push: {
                    messages: { senderEmail: req.user.email, body: req.body.message},
                },
            },
            { }
        );
        return res.status(200).json({success:true, message:'message sent'});
    }catch(error){
        return res.status(500).json({success:false, message:'error while sending message', error:error});
    }
    
}

async function getChat(req, res){
    try{
        if(!req.body.email){
            return res.status(400).json({success:false, message:'Provide the other users email'});
        }
        req.body.email = req.body.trimEnd().toLowerCase();
        const chatemails = [req.user.email, req.body.email].sort();
        const result = await Chat.findOne({email : chatemails});

        return res.status(200).json({success:true, message: 'chat fetched', data:result})
        
    }
    catch(error){
        return res.status(500).json({success:false, message:'error while fetching chat', error:error});
    }
}
async function createChat(req, res){
    try{
        if(!req.user.email){
            return res.status(500).json({success:false, message:'Error fetching cookie data'});
        }
        if(!req.body.email){
            return res.status(400).json({success:false, message:'Provide the receiver email'});
        }
        req.body.email = req.body.trimEnd().toLowerCase();
        const chatemails = [req.user.email, req.body.email].sort();
        await Chat.create({email:chatemails});
        return res.status(200).json({success:true, message: 'Chat created'});
    }
    catch(e){
        return res.status(500).json({success:false, message:"Error while creating chat"});
    }
}

module.exports = {
    getChat,
    postMessage,
    createChat,
}