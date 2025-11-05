const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
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
        enum: ['Veg', 'Non-Veg', 'Jain', 'Vegan', 'Any'],
        default: 'Any'
    },
    religion: {
        type: String,
        enum: ["Hinduism", "Islam", "Christianity", "Judaism", "Sikhism", "Jainism", "Buddhism","Taoism", "Zoroastrianism", "Other", "Any"] ,
        default: "Any" 
    },
    alcohol: {
        type: Boolean,
        default: false
    },
    smoker: {
        type: Boolean,
        default: false
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
        default: false
    },
    hobbies: {
        type: [String],
        default: []
    },
    professional_status: {
        type: String,
        enum: ['student', 'working', 'Any'],
        default: 'Any'
    },
    workingshifts: {
        type: String,
        enum: ['morning', 'night', 'Any'],
        default: 'Any'
    },    
    havePet: {
        type: Boolean,
        default: false
    },
    workPlace: {
        type: String,
        default: 'Any'
    },
    descriptions: {
        type: String,
        default: ''
    },
    maritalStatus: { type: String, 
        enum: ["Single", "Married", "Any"], 
        default: "Any"
    },
    family: {
        type: Boolean
    },
    language: { type: String, default: "Any" },
    minStayDuration: { type: Number, default: 0 },

}, { timestamps: true });

const Tenant = mongoose.model('tenant', tenantSchema);

module.exports = Tenant;
