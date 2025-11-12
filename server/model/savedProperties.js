const mongoose = require('mongoose');

const savedPropertiesSchema = new mongoose.Schema({
    email: {
        type: String,
        required:true,
        unique:true
    },
    properties: [{
        propertyName: { type: String, required: true },
        propertyEmail: { type: String, required: true }
    }]
});

const savedProperties = mongoose.model('savedProperties', savedPropertiesSchema);

module.exports = savedProperties;