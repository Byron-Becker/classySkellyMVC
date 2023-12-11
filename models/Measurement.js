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
    flexion: String,
    extension: String,
    rightGlide: String,
    leftGlide: String
  },
  painRating: [Number],
  notes: [String],
  exerciseOutcome: {
    color: String, // 'green', 'yellow', or 'red'
    message: String, // A message for the user about the outcome
    improvedArea: String, // 'pain', 'rom', or 'both'
  }
});

MeasurementSchema.statics.getInitialAssessment = function(patientId) {
  return this.findOne({ 
      patient_Id: patientId, 
      exerciseGiven: 'initialAssessment' 
  }).sort({ dateCreated: 1 });
};

module.exports = mongoose.model("Measurement", MeasurementSchema);
