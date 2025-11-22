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
        required: true,
    },
    rentupper: {
        type: Number,
        required: true,
    }
}, { timestamps: true });

roommateSchema.index({ email: 1, city: 1 }, { unique: true }); //composite key

const roommate = mongoose.model('roommate', roommateSchema);

module.exports = roommate;