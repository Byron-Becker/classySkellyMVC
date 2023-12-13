const mongoose = require("mongoose");

const MeasurementSchema = new mongoose.Schema({
  clinician_Id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' // Replace 'User' with your Clinician model
  },
  patient_Id: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    required: true,
    default: Date.now
  },
  exerciseGiven: {
    type: String,
    required: true
  },
  rom: {
    flexion: [Boolean],
    extension: [Boolean],
    rightGlide: [Boolean],
    leftGlide: [Boolean]
  },
  painRating: [Number],
  notes: [String]
});

module.exports = mongoose.model("Measurement", MeasurementSchema);
