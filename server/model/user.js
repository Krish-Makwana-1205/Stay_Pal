const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email:{
        required:true,
        unique:true,
        type:String,
    },
    username:{
        required:true,
        unique:true,
        type:String
    },
    password:{
        required:true,
        type:String
    },
    profilePhoto:{
        type: String,
        default:"",
    },
    istenant:{
        type: Boolean,
        default: false,
    },
    isroommate:{
        type: Boolean,
        default: false,
    }
},{timestamps:true});

const User = mongoose.model('user', userSchema);

module.exports = User;