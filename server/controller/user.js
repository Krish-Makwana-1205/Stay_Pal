const user = require('../model/user');
const bcrypt = require('bcrypt');
const salt = 5;
const { setUser, getUser } = require('../service/auth');

const { createAndSendOtp, verifyOtp, deleteOtp } = require('../utils/otpHelper');

async function sendOtp(req, res) {
    const body = req.body;
    let tem;
    body.email = (body.email.trimEnd().toLowerCase());
    if (!body.email) {
        return res.status(400).json({ success: false, message: "email not provided" });
    }
    try {
        tem = await user.find({ email: body.email });
    } catch (e) {
        return res.status(500).json({ error: e, message: 'DB interaction not working' })
    }
    if (tem.length == 0) {

    }
    else {
        return res.status(400).json({ message: "The email is already registered", error: "The email is already registered" });
    }
    try {
        createAndSendOtp(body.email);
        return res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (error) {
        return res.status(500).json({ message: 'error in sending otp', error: error.message })
    }

}

async function uploadProfilePhoto(req, res) {
  try {
    if (!req.file){
      return res.status(400).json({message:"No image uploaded"});
    }
    const imageUrl =req.file.path;
    const body =req.body;
    if (!body.email||!body.username){
      return res.status(400).json({message:"Email and username are required"});
    }
    const updatedUser =await User.findOneAndUpdate(
      {email: body.email, username: body.username },
      {profilePhoto:imageUrl },
      {new:true,upsert:true}
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      message: "Profile photo uploaded successfully",
      profilePhoto: updatedUser.profilePhoto,
    });
  } catch (error) {
    console.error("Error uploading profile photo:", error);
    return res.status(500).json({ message: "Error uploading profile photo", error });
  }
}



async function makeUser(req, res) {
    const body = req.body;
    let using;
    if (!body.password) {
        return res.status(400).json({ success: false, message: "password not provided" });
    }
    if ((!body.name) || (!body.email) || (!body.password)) {
        return res.status(400).json({ success: false, message: "User creation failed due to missing fields" });
    }
    body.email = (body.email.trimEnd().toLowerCase());
    body.name = (body.name.trimEnd());
    body.password = (body.password.trimEnd());
    const newpassword = await bcrypt.hash(body.password, salt);
    if (!body.otp) {
        return res.status(400).json({ success: false, message: "provide OTP for user creation" });
    }
    const type = await verifyOtp(body.email, body.otp);
    if (type == 2) {
        return res.status(400).json({ success: false, message: "Incorrect OTP provided" });
    }
    else if (type == 3) {
        return res.status(400).json({ success: false, message: "OTP you provided is expired" });
    }
    else if (type != 1) {
        return res.status(500).json({ error: type });
    }
    deleteOtp(body.email);
    try {
        const updateduser = await user.findOneAndUpdate(
            { email: body.email},
            {
                email:body.email,
                username: body.name,
                password: newpassword,
            },
            {
                new: true,      
                upsert: true,   
                setDefaultsOnInsert: true,
            }
        );
    } catch (error) {
        return res.status(500).json({ success: false, message: "User creation failed", error: error.message });
    }
    const token = setUser(body.email);
    res.cookie('uid', token);
    return res.status(200).json({ success: true, message: "User created. OTP sent to email." });
}

async function loginUser(req, res) {
    const body = req.body;
    if ((!body.email) || (!body.password)) {
        return res.status(400).json({ success: false, message: "email or password empty" });
    }
    body.email = (body.email.trimEnd().toLowerCase());
    body.password = (body.password.trimEnd());
    const User = await user.findOne({ email: body.email });
    if (!User) {
        return res.status(400).json({ success: false, message: "email not present in data base" });
    }
    const isMatch = await bcrypt.compare(body.password, User.password);
    if (!isMatch) {
        return res.status(400).json({ success: false, message: "Password is incorrect" });
    }
    const token = setUser(User);
    res.cookie('uid', token);
    return res.status(200).json({ success: true, message: "User login" });
}

async function provideUser(req, res) {
    const using = await user.findOne({email:req.user.email});
    return res.status(200).json({
        success: true,
        user: using,
    });
}

async function forgotPasswordOtp(req, res) {
    const body = req.body;
    if ((!body.email)) {
        return res.status(400).json({ success: false, message: "Email not provided" });
    }
    body.email = (body.email.trimEnd().toLowerCase());
    let temp;
    try {
        temp = await user.findOne({ email: body.email });
    } catch (e) {
        return res.status(500).json({ message: 'database cannot be reached', error: error.message })
    }
    if (temp == null) {
        return res.status(400).json({ success: false, message: "Email is not registered" });
    }
    body.email = (body.email.trimEnd().toLowerCase());
    try {
        createAndSendOtp(body.email);
        return res.status(200).json({ success: true, message: "OTP sent successfully" });

    } catch (error) {
        return res.status(500).json({ message: 'error in sending otp', error: error.message })
    }

}

async function forgotPassword(req, res) {
    const body = req.body;
    if (!body.email) {
        return res.status(500).json({ success: false, message: "React error email not provided" });
    }
    body.email = (body.email.trimEnd().toLowerCase());
    if (!body.password) {
        return res.status(400).json({ success: false, message: "New Password not provided" });
    }
    body.password = body.password.trimEnd();
    if (!body.otp) {
        return res.status(400).json({ success: false, message: "OTP not provided" });
    }
    body.otp = body.otp.trimEnd();
    const type = await verifyOtp(body.email, body.otp);
    if (type == 2) {
        return res.status(400).json({ success: false, message: "Incorrect OTP provided" });
    }
    else if (type == 3) {
        return res.status(400).json({ success: false, message: "OTP you provided is expired" });
    }
    else if (type != 1) {
        return res.status(500).json({ error: type });
    }
    const newpassword = await bcrypt.hash(body.password, salt);
    deleteOtp(body.otp);
    try {
        await user.updateOne(
            { email: body.email },
            { $set: { password: newpassword } }
        );
    } catch (e) {
        return res.status(500).json({ message: 'unable to update password', error: e.message })
    }
    return res.status(200).json({ success: true });
}
function logOut(req, res) {
    res.clearCookie("uid", {
        httpOnly: true,
        sameSite: "strict",
    });
    res.status(200).json({ message: "Logged out successfully" });
}
module.exports = {
    makeUser,
    loginUser,
    provideUser,
    sendOtp,
    logOut,
    forgotPasswordOtp,
    forgotPassword,
    uploadProfilePhoto
};