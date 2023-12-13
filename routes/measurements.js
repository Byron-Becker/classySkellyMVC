const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const measurementsController = require("../controllers/measurements");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Measurement Routes - simplified for now
router.get("/:id", ensureAuth, measurementsController.getMeasurement);

router.post("/createMeasurement", measurementsController.createMeasurement);


module.exports = router;
