const Measurement = require('../models/Measurement');

async function comparePainRatings(currentRatings, patientId, currentExercise, currentAssessmentId) {
    const previousAssessment = await Measurement.findOne({ 
        patient_Id: patientId,
        _id: { $ne: currentAssessmentId }
    }).sort({ dateCreated: -1 });

    if (!previousAssessment || !previousAssessment.painRating) {
        return "Initial assessment: proceed with the current exercise plan.";
    }

    const previousRatings = previousAssessment.painRating;

    console.log(`Current Ratings: ${currentRatings}`);
    console.log(`Previous Ratings: ${previousRatings}`);

    let isImproved = false;
    let isWorsened = false;

    for (let i = 0; i < currentRatings.length; i++) {
        let currentRating = currentRatings[i] ?? 0; // Treat null as zero
        let previousRating = previousRatings[i] ?? 0; // Treat null as zero

        let change = ((currentRating - previousRating) / previousRating) * 100;
        console.log(`Index ${i} - Change calculated: ${change}%`);

        // Negative change greater than 20% indicates improvement
        if (change < -20) {
            isImproved = true;
            break; // Break as soon as an improvement is detected
        } 
        // Positive change greater than 10% indicates worsening
        else if (change > 10) {
            isWorsened = true;
        }
    }

    if (isImproved) {
        return `Greenlight: you should give the pt the current exercise of ${currentExercise}`;
    } else if (isWorsened) {
        return "Wait a minute and retest, if still worse then try a force regression or force alternative.";
    }

    return "Use a force progression.";
}

module.exports = {
    comparePainRatings
};
