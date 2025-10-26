const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true},
    imgLink: [{type: String}],
    description: {type: String, required: true},
    BHK : {type: Number, required:true},
    rentLowerBound: {type: Number, required:true},
    rentUpperBound: {type: Number, required:true},
    nation: {type: String, required:true},
    pincode: {type: String, required:true},
    city: {type: String, required:true}
}, {timestamps:true});

propertySchema.index({ email: 1, name: 1 }, { unique: true }); // composite key

const property = mongoose.model('property', propertySchema);

module.exports = property;