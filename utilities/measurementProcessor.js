const Measurement = require('../models/Measurement');

async function comparePainRatings(currentRatings, patientId, currentExercise) {
    // Fetch the most recent previous assessment
    const previousAssessment = await Measurement.find({ patient_Id: patientId })
                                                .sort({ dateCreated: -1 })
                                                .limit(1);

    const previousRatings = previousAssessment.length > 0 ? previousAssessment[0].painRating : [];

    // If there's no previous assessment, handle as initial assessment
    if (!previousRatings || previousRatings.length === 0) {
        return "Initial assessment: proceed with the current exercise plan.";
    }

    // Compare pain ratings
    for (let i = 0; i < currentRatings.length; i++) {
        if (previousRatings[i] === null || currentRatings[i] === null) {
            continue; // Skip comparison if any rating is null
        }

        let change = (currentRatings[i] - previousRatings[i]) / previousRatings[i] * 100;

        if (change > 20) {
            return `Greenlight: you should give the pt the current exercise of ${currentExercise}`;
        } else if (change < -10) {
            return "Wait a minute and retest, if still worse then try a force regression or force alternative.";
        }
    }

    return "Use a force progression.";
}

module.exports = {
    comparePainRatings
};
