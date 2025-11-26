const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  tenantEmail: {type: String,required: true},
  propertyName: {type: String,required: true},
  propertyOwnerEmail: {type: String,required: true,lowercase: true,trim: true},
  applicationDate: {type: Date, default: Date.now},
});

const Application = mongoose.model('Application', applicationSchema);

module.exports = Application;
