const Measurement = require('../models/Measurement');

async function comparePainRatings(currentRatings, previousRatings) {
    console.log(`Current Pain Ratings: ${currentRatings}`);
    console.log(`Previous Pain Ratings: ${previousRatings}`);

    let isImproved = false;
    let isWorsened = false;

    for (let i = 0; i < currentRatings.length; i++) {
        let currentRating = currentRatings[i] ?? 0;
        let previousRating = previousRatings[i] ?? 0;

        let change = ((currentRating - previousRating) / previousRating) * 100;
        console.log(`Pain Rating Change at Index ${i}: ${change}%`);

        if (change < -20) {
            isImproved = true;
            break;
        } else if (change > 10) {
            isWorsened = true;
        }
    }

    if (isImproved) {
        return "Green Light";
    } else if (isWorsened) {
        return "Red Light";
    }

    return "Yellow Light";
}

function compareROMRatings(currentROM, previousROM) {
    const romLevels = { 'nil': 0, 'minimum': 1, 'moderate': 2, 'major': 3 };
    let isImproved = false;
    let isWorsened = false;

    for (const movement in currentROM) {
        console.log(`Current ROM for ${movement}: ${currentROM[movement]}, Previous: ${previousROM[movement]}`);

        const currentLevel = romLevels[currentROM[movement]] || 0;
        const previousLevel = romLevels[previousROM[movement]] || 0;

        if (currentLevel < previousLevel) {
            console.log(`${movement} - Improvement detected`);
            isImproved = true;
            break;
        } else if (currentLevel > previousLevel) {
            console.log(`${movement} - Worsening detected`);
            isWorsened = true;
            break;
        }
    }

    if (isImproved) {
        return "Green Light";
    } else if (isWorsened) {
        return "Red Light";
    }

    return "Yellow Light";
}

async function comparePainAndRomRatings(currentAssessment, patientId) {
    const previousAssessment = await Measurement.findOne({ 
        patient_Id: patientId,
        _id: { $ne: currentAssessment._id }
    }).sort({ dateCreated: -1 });

    if (!previousAssessment) {
        return "Initial assessment: proceed with the current exercise plan.";
    }

    const painOutcome = comparePainRatings(currentAssessment.painRating, previousAssessment.painRating);
    console.log(`Pain Assessment Outcome: ${painOutcome}`);

    const romOutcome = compareROMRatings(currentAssessment.rom, previousAssessment.rom);
    console.log(`ROM Assessment Outcome: ${romOutcome}`);

    // Determine overall outcome
    if (painOutcome === "Red Light" || romOutcome === "Red Light") {
        return "Red Light: Reassess and adjust the treatment.";
    } else if (painOutcome === "Green Light" || romOutcome === "Green Light") {
        return "Green Light: Continue with the current exercise.";
    } else {
        return "Yellow Light: No significant change.";
    }
}

function combineOutcomes(romOutcome, painOutcome, currentExercise) {
    // Logic to determine the final outcome based on romOutcome and painOutcome
    let color = 'yellow'; // Default to yellow light
    let message = 'No significant change.';
  
    if (romOutcome === 'Green Light' || painOutcome === 'Green Light') {
      color = 'green';
      message = `Greenlight: you should give the patient the current exercise of ${currentExercise}`;
    } else if (romOutcome === 'Red Light' || painOutcome === 'Red Light') {
      color = 'red';
      message = 'Redlight: Reassess and consider an alternative approach.';
    }
  
    return { color, message };
  }

module.exports = {
    comparePainRatings,
    compareROMRatings,
    comparePainAndRomRatings,
    combineOutcomes
};
