const cloudinary = require("../middleware/cloudinary");
const Measurement = require("../models/Measurement");
const measurementProcessor = require('../utilities/measurementProcessor');

module.exports = {

  getProfile: async (req, res) => {
    try {
      const posts = await Measurement.find({ user: req.user.id });
      res.render("profile.ejs", { posts: posts, user: req.user });
    } catch (err) {
      console.log(err);
    }
  },

  createMeasurement: async (req, res) => {
    try {
        // Create and store the new measurement
        const newMeasurement = await Measurement.create({
            clinician_Id: req.user.id, 
            patient_Id: req.body.patient_Id, 
            dateCreated: new Date(),
            exerciseGiven: req.body.exerciseGiven,
            rom: {
                flexion: [
                    req.body.rom_flexion_major === 'on',
                    req.body.rom_flexion_moderate === 'on',
                    req.body.rom_flexion_minimum === 'on',
                    req.body.rom_flexion_nil === 'on'
                ],
                extension: [
                    req.body.rom_extension_major === 'on',
                    req.body.rom_extension_moderate === 'on',
                    req.body.rom_extension_minimum === 'on',
                    req.body.rom_extension_nil === 'on'
                ],
                rightGlide: [
                    req.body.rom_rightglide_major === 'on',
                    req.body.rom_rightglide_moderate === 'on',
                    req.body.rom_rightglide_minimum === 'on',
                    req.body.rom_rightglide_nil === 'on'
                ],
                leftGlide: [
                    req.body.rom_leftglide_major === 'on',
                    req.body.rom_leftglide_moderate === 'on',
                    req.body.rom_leftglide_minimum === 'on',
                    req.body.rom_leftglide_nil === 'on'
                ]
            },
            painRating: req.body.rating, // Array of pain ratings
            notes: req.body.notes // Array of notes
        });

        console.log("Measurement has been added!");

        // Compare with the previous assessment if not the initial session
        if (req.body.exerciseGiven !== 'initialAssessment') {
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

            console.log("Outcome of pain rating comparison:", outcome);
        }

        res.redirect("/profile"); // Adjust the redirect as needed
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
