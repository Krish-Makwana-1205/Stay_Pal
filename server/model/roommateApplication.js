const mongoose = require("mongoose");

const roommateApplicationSchema = new mongoose.Schema({
  applicantEmail: { type: String, required: true },
  recipientEmail: { type: String, required: true },
  appliedAt: { type: Date, default: Date.now }
});

// Composite Unique Key to prevent duplicate roommate requests
roommateApplicationSchema.index(
  { applicantEmail: 1, recipientEmail: 1 },
  { unique: true }
);

module.exports = mongoose.model("RoommateApplication", roommateApplicationSchema);
