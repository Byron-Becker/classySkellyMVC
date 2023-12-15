const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const measurementsController = require("../controllers/measurements");
const { ensureAuth, ensureGuest } = require("../middleware/auth");
const Measurement = require('../models/Measurement'); // Adjust the path as per your file structure


//Measurement Routes - simplified for now
router.get("/:id", ensureAuth, measurementsController.getMeasurement);

router.post("/createMeasurement", measurementsController.createMeasurement);

router.get('/test-initial-assessment/:patientId', async (req, res) => {
  try {
    const patientId = req.params.patientId;
    const initialAssessment = await Measurement.getInitialAssessment(patientId);

    if (!initialAssessment) {
      return res.status(404).send('Initial assessment not found');
    }

    res.status(200).json(initialAssessment);
  } catch (error) {
    console.error(error);
    res.status(500).send('Server Error');
  }
});

module.exports = router;
