const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema({
  tenantEmail: { type: String, required: true },
  propertyName: { type: String, required: true },
  propertyOwnerEmail: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now }
});

// Composite Unique Key 
applicationSchema.index({ tenantEmail: 1, propertyName: 1, propertyOwnerEmail: 1 }, { unique: true });

module.exports = mongoose.model("Application", applicationSchema);
