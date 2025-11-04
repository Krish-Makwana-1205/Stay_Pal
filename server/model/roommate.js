const mongoose = require('mongoose');

const roommateSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    foodPreference: {
        type: String,
        enum: ['Veg', 'Non-Veg', 'Jain', 'Vegan'],
    },
    religion: {
        type: String
    },
    alcohol: {
        type: Boolean,

    },
    smoker: {
        type: Boolean,
    },
    hometown: {
        type: String,
        required: true,
    },
    nationality: {
        type: String,
        required: true
    },
    nightOwl: {
        type: Boolean,
    },
    hobbies: {
        type: [String] 
    },
    professional_status:{
        type: String,
        enum: ['student', 'working'],
    },
    workingshifts: {
        type: String,
        enum: ['morning', 'night'],
 
    },    
    havePet: {
        type: Boolean,
    },
    workPlace: {
        type: String,
    },
    descriptions: {
        type: String,
    }
}, { timestamps: true });

const roommate = mongoose.model('roommate', roommateSchema);

module.exports = roommate;