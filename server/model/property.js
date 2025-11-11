const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
    email: { type: String, required: true },
    name: { type: String, required: true},
    imgLink: [{type: String}],
    description: {type: String, required: true},
    BHK : {type: Number, required:true},
    address: { type: String},
    addressLink: { type: String},
    rent: {type: Number, required:true},
    nation: {type: String, required:true},
    pincode: {type: String, required:true},
    city: {type: String, required:true},
    locality: {type:String, required:true},
    furnishingType: { type: String, enum: ["Fully Furnished", "Semi Furnished", "Unfurnished","Any"], default: "Any" },
    areaSize: { type: Number },
    nearbyPlaces: [{ type: String, enum: ["Market", "Bus Stop", "School", "Hospital", "Metro"]}], // e.g. 
    transportAvailability: { type: Boolean, default: false },
    parkingArea: { type: String },
    houseType: {type:String, enum:["Apartment", "Tenament", "Bungalow", "Studio", "Condo", "Other"], required:true},
    // location: {type: {type: String,enum: ["Point"],default: "Point",required: true},coordinates: { type: [Number],required: true} },
    // latitude: { type: Number },
    // longitude: { type: Number },
    isRoommate: {type: Boolean, default: false},
    tenantPreferences: {
    
        gender: { type: String, enum: ["Male", "Female", "Any"], default:"Any"},
        upperagelimit: { type: Number },
        loweragelimit: { type: Number },
        occupation: { type: String },
        maritalStatus: { type: String, enum: ["Single", "Married", "Any"], default: "Any"},
        family: { type: String, enum: ["Allowed", "Not Allowed", "Any"], default: "Any"},
        foodPreference: { type: String, enum: ["Vegetarian", "Non-Vegetarian", "Any"], default: "Any"},
        smoking: { type: Boolean, default: false},
        alcohol: { type: Boolean,  default: false},
        pets: { type: Boolean, default: false},
        nationality: { type: String, default: "Any" },
        workingShift: { type: String, enum: ["Day Shift", "Night Shift", "Any"], default: "Any" },
        professionalStatus: { type: String, enum: ["Student", "Employed", "Self-Employed", "Any"], default: "Any" },
        religion: { type: String, enum: ["Hinduism", "Islam", "Christianity", "Judaism", "Sikhism", "Jainism", "Buddhism","Taoism", "Zoroastrianism", "Other", "Any", "Atheist"] ,default: "Any" },
        language: { type: String, default: "Any" },
        minStayDuration: { type: Number, default: 0 },
        maxPeopleAllowed: { type: Number, default: 0 },
        notes: { type: String }
    }
}, {timestamps:true});

propertySchema.index({ email: 1, name: 1 }, { unique: true }); // composite key

//For faster filtering
propertySchema.index({ city: 1 });
propertySchema.index({ rent: 1 });

const property = mongoose.model('property', propertySchema);

module.exports = property;