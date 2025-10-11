const user = require('../model/user');
const bcrypt = require('bcrypt');
const salt = 5;
const { setUser, getUser } = require('../service/auth');

const { createAndSendOtp,verifyOtp, deleteDB } = require('../utils/otpHelper'); 

async function sendOtp(req, res){
    const body = req.body;
    body.email = (body.email.trimEnd().toLowerCase());
    if(!body.email){
        return res.status(400).json({ success: false, message: "email not provided" });
    }
    try{
        tem = await user.find({email:body.email}); 
    }catch(e){
        return res.status(500).json({error:e, message:'DB interaction not working'})
    }
    if(tem.length == 0){

    }
    else{
        return res.status(400).json({message:"The email is already registered", error:"The email is already registered"});
    }
    try{
        await createAndSendOtp(body.email);
        return res.status(200).json({"success":true, message:"OTP successfully sent"});
    }catch(error){
        return res.status(500).json({ message:'error in sending otp',error: error.message})
    }

}

async function makeUser(req, res){
    const body = req.body;
    
    let using;

    if (!body.password) {
        console.log('Password not provided');
        return res.status(400).json({ success: false, message: "password not provided" });
    }

    const newpassword = await bcrypt.hash(body.password, salt);

    if ((!body.name) || (!body.email) || (!body.password)) {
        return res.status(400).json({ success: false, message: "User creation failed due to missing fields" });
    }
    body.email = (body.email.trimEnd().toLowerCase());
    body.name = (body.name.trimEnd());
    body.password = (body.password.trimEnd());
    if(!body.otp){
        return res.status(400).json({ success: false, message: "provide OTP for user creation" });
    }
    const type = await verifyOtp(body.email, body.otp);
    if(type == 2){
        return res.status(400).json({ success: false, message: "Incorrect OTP provided" });
    }
    else if(type != 1){
        return res.status(500).json({error:type});
    }
    let fl = deleteDB(body.otp);
    if(!fl){
        
    }
    try {
        using = await user.create({
            username: body.name,
            email: body.email,
            password: newpassword
        });

    } catch (error) {
        console.log('User creation error:', error);
        return res.status(500).json({ success: false, message: "User creation failed", error: error.message });
    }

    const token = setUser(using);
    res.cookie('uid', token);
    console.log('true');
    return res.status(200).json({ success: true, message: "User created. OTP sent to email." });
}

async function loginUser(req, res) {
    const body = req.body;

    if ((!body.email) || (!body.password)) {
        console.log("fail1");
        return res.status(400).json({ success: true, message: "email or password empty" });
    }

    const User = await user.findOne({ email: body.email });
    if (!User) {
        console.log('email not present in data base');
        return res.status(400).json({ success: false, message: "email not present in data base" });
    }
    const isMatch = await bcrypt.compare(body.password, User.password);
    if (!isMatch) {
        console.log("Password is incorrect");
        return res.status(400).json({ success: false, message: "Password is incorrect" });
    }
    const token = setUser(User);
    res.cookie('uid', token);
    return res.status(200).json({ success: true, message: "User login" });
}

function provideUser(req, res) {
    res.user = req.user;
    return res.status(200).json({
        success: true,
        user: req.user,
    });
}

module.exports = {
    makeUser,
    loginUser,
    provideUser,
    sendOtp
};
