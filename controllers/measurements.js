const cloudinary = require("../middleware/cloudinary");
const Measurement = require("../models/Measurement");
const measurementProcessor = require('../utilities/measurementProcessor');

module.exports = {

  getProfile: async (req, res) => {
    try {
      const posts = await Measurement.find({ user: req.user.id });
      res.render("profile.ejs", {
        posts: posts,
        user: req.user,
        outcome: {} // Include an empty outcome object
      });
    } catch (err) {
      console.log(err);
      res.render("error.ejs", { error: err }); // Render an error page or handle the error appropriately
    }
  },

  createMeasurement: async (req, res) => {
    try {
      // Extract and format ROM data from the request
      const romData = {
        flexion: req.body.rom_flexion,
        extension: req.body.rom_extension,
        rightGlide: req.body.rom_rightglide,
        leftGlide: req.body.rom_leftglide
      };

      // Create and store the new measurement
      const newMeasurement = await Measurement.create({
        clinician_Id: req.user.id, 
        patient_Id: req.body.patient_Id, 
        dateCreated: new Date(),
        exerciseGiven: req.body.exerciseGiven,
        rom: romData,
        painRating: req.body.rating, // Array of pain ratings
        notes: req.body.notes // Array of notes
      });

      let outcome = {
        color: 'green',
        message: 'Initial assessment: proceed with the current exercise plan.'
      };

      // Compare with the previous assessment if not the initial session
      if (req.body.exerciseGiven !== 'initialAssessment') {
        const previousAssessment = await Measurement.findOne({ 
            patient_Id: req.body.patient_Id,
            _id: { $ne: newMeasurement._id } // Exclude the current assessment
        }).sort({ dateCreated: -1 });

        if (previousAssessment) {
          // Use utility function for processing ROM
          const romOutcome = measurementProcessor.compareROMRatings(romData, previousAssessment.rom);

          // Use utility function for pain ratings
          const painOutcome = measurementProcessor.comparePainRatings(req.body.rating, previousAssessment.painRating);

          // Combine the outcomes
          outcome = measurementProcessor.combineOutcomes(romOutcome, painOutcome, req.body.exerciseGiven);
        }
      }

      // Render the profile with the outcome to display it on the page
      const posts = await Measurement.find({ user: req.user.id });
      res.render("profile.ejs", {
        posts: posts,
        user: req.user,
        outcome: outcome // Pass the outcome to the view
      });

    } catch (err) {
      console.log(err);
      res.status(500).send("Server Error");
    }
  },

createOrUpdateMeasurement: async (req, res) => {
  try {
      const patientId = req.body.patient_Id;
      const currentRatings = req.body.rating; // Array of current pain ratings
      const currentExercise = req.body.exerciseGiven;

      // Fetch the most recent previous assessment
      const previousAssessment = await Measurement.find({ patient_Id: patientId })
                                                  .sort({ dateCreated: -1 })
                                                  .limit(1);

      const previousRatings = previousAssessment.length > 0 ? previousAssessment[0].painRating : [];

      // Use utility function for processing
      const outcome = await measurementProcessor.comparePainRatings(currentRatings, patientId, currentExercise);

      // Save the current assessment
      await Measurement.create({
          // ... data from the request ...
      });

      // Respond with the outcome
      res.status(200).json({ message: outcome });
  } catch (error) {
      console.error(error);
      res.status(500).send('Server Error');
  }
},












// Unclear what this is doing below and how it syncs up with the main.js in routes
getMeasurement: async (req, res) => {
  try {
    const post = await Measurement.findById(req.params.id);
    res.render("post.ejs", { post: post, user: req.user });
  } catch (err) {
    console.log(err);
  }
},


};
