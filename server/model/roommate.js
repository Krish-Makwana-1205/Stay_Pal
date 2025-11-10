const mongoose = require('mongoose');

const roommateSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    city:{
        type:String,
        required:true,
    },
    rentlower:{
        type:Number,
        require:true,
    },
    rentupper:{
        type:Number,
        required:true,
    },
}, { timestamps:true});

roommateSchema.index({ email: 1, city: 1 }, { unique: true }); //composite key
roommateSchema.index({email: 1});

const roommate = mongoose.model('roommate', roommateSchema);

module.exports = roommate;