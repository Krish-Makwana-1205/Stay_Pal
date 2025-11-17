const mongoose = require('mongoose');

const roommateSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    city: {
        type: String,
        required: true,
    },
    rentlower: {
        type: Number,
        require: true,
    },
    rentupper: {
        type: Number,
        required: true,
    },
    roommatepreference: {
        gender: { type: String, enum: ["Male", "Female", "Any"], default: "Any" },
        upperagelimit: { type: Number },
        loweragelimit: { type: Number },
        occupation: { type: String },
        maritalStatus: { type: String, enum: ["Single", "Married", "Any"], default: "Any" },
        family: { type: String, enum: ["Allowed", "Not Allowed", "Any"], default: "Any" },
        foodPreference: { type: String, enum: ["Vegetarian", "Non-Vegetarian", "Any"], default: "Any" },
        smoking: { type: Boolean, default: false },
        alcohol: { type: Boolean, default: false },
        pets: { type: Boolean, default: false },
        nationality: { type: String, default: "Any" },
        workingShift: { type: String, enum: ["Day Shift", "Night Shift", "Any"], default: "Any" },
        professionalStatus: { type: String, enum: ["Student", "Employed", "Self-Employed", "Any"], default: "Any" },
        religion: { type: String, enum: ["Hinduism", "Islam", "Christianity", "Judaism", "Sikhism", "Jainism", "Buddhism", "Taoism", "Zoroastrianism", "Other", "Any", "Atheist"], default: "Any" },
        language: { type: String, default: "Any" },
        minStayDuration: { type: Number, default: 0 },
        notes: { type: String },
        earlyBird: { type: Boolean, default: false },
        nightOwl: { type: Boolean, default: false },
        studious: {
            type: Boolean,
            default: false
        },
        fitness_freak: {
            type: Boolean,
            default: false
        },
        sporty: {
            type: Boolean,
            default: false
        },
        wanderer: {
            type: Boolean,
            default: false
        },
        party_lover: {
            type: Boolean,
            default: false
        },
        hobbies: {
            type: [String],
            default: []
        },

    }
}, { timestamps: true });

roommateSchema.index({ email: 1, city: 1 }, { unique: true }); //composite key

const roommate = mongoose.model('roommate', roommateSchema);

module.exports = roommate;