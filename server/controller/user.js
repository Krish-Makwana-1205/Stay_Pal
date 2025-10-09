const user = require('../model/user');
const bcrypt = require('bcrypt');
const salt = 5;
const { setUser, getUser } = require('../service/auth');

// OTP helper
const { createAndSendOtp } = require('../utils/otpHelper'); // ⬅️ Include this

async function makeUser(req, res) {
    console.log(req.body);
    const body = req.body;
    let using;

    if (!body.password) {
        console.log('Password not provided');
        return res.status(400).json({ success: false, message: "password not provided" });
    }

    const newpassword = await bcrypt.hash(body.password, salt);

    if ((!body.name) || (!body.email) || (!body.password)) {
        console.log('false1');
        return res.status(400).json({ success: false, message: "User creation failed" });
    }

    try {
        using = await user.create({
            username: body.name,
            email: body.email,
            password: newpassword
        });

        // ✅ Send OTP after user creation
        await createAndSendOtp(body.email);

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
    console.log(req.body);
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
    console.log('success');
    return res.status(200).json({ success: true, message: "User login" });
}

function provideUser(req, res) {
    res.user = req.user;
    console.log(res.user);
    return res.status(200).json({
        success: true,
        user: req.user,
    });
}

module.exports = {
    makeUser,
    loginUser,
    provideUser
};
