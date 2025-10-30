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
    city: {type: String, required:true},
    furnishingType: { type: String, enum: ["Fully Furnished", "Semi Furnished", "Unfurnished"], default: "Unfurnished" },
    areaSize: { type: Number },
    nearbyPlaces: [{ type: String }], // e.g. ["Market", "Bus Stop", "School"]
    transportAvailability: { type: Boolean, default: false },
    parkingArea: { type: Boolean, default: false },
    specialFeatures: [{ type: String }],

    tenantPreferences: {
    
        gender: { type: String, enum: ["Male", "Female", "Any"], default:"Any"},
        ageRange: { type: String },
        occupation: { type: String },
        maritalStatus: { type: String, enum: ["Single", "Married", "Any"], default: "Any"},
        family: { type: String, enum: ["Allowed", "Not Allowed", "Any"], default: "Any"},
        foodPreference: { type: String, enum: ["Vegetarian", "Non-Vegetarian", "Any"], default: "Any"},
        smoking: { type: String, enum: ["Allowed", "Not Allowed", "Any"], default: "Any"},
        alcohol: { type: String, enum: ["Allowed", "Not Allowed", "Any"], default: "Any"},
        pets: { type: Boolean, default: false},
        nationality: { type: String, default: "Any" },
        workingShift: { type: String, enum: ["Day Shift", "Night Shift", "Any"], default: "Any" },
        professionalStatus: { type: String, enum: ["Student", "Employed", "Self-Employed", "Any"], default: "Any" },
        religion: { type: String, default: "Any" },
        language: { type: String, default: "Any" },
        minStayDuration: { type: Number, default: 0 },
        maxPeopleAllowed: { type: Number, default: 0 },
        notes: { type: String }
    }
}, {timestamps:true});

propertySchema.index({ email: 1, name: 1 }, { unique: true }); // composite key

const property = mongoose.model('property', propertySchema);

module.exports = property;