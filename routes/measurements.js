const express = require("express");
const router = express.Router();
const upload = require("../middleware/multer");
const measurementsController = require("../controllers/measurements");
const { ensureAuth, ensureGuest } = require("../middleware/auth");

//Post Routes - simplified for now
router.get("/:id", ensureAuth, measurementsController.getMeasurement);

router.post("/createMeasurement", measurementsController.createMeasurement);

router.put("/likePost/:id", measurementsController.likePost);

router.delete("/deletePost/:id", measurementsController.deletePost);

module.exports = router;
