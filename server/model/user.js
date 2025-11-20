const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: true,
        unique: true,
    },
    username:{
        type: String,
        required: true,
    },
    password:{
        type: String,
        default: null,  
    },
    profilePhoto:{
        type: String,
        default: "../public/profile-pic.jpg",
    },
    istenant:{
        type: Boolean,
        default: false,
    },
    isroommate:{
        type: Boolean,
        default: false,
    },
    googleId:{
        type: String,
        default: null,  
    }
},{timestamps:true});

module.exports = mongoose.model("User", userSchema);
