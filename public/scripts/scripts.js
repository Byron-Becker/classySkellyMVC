app.use(express.static('public'));


// JavaScript for dynamically updating the exercises dropdown
function updateExercises() {
    var series = document.getElementById('exerciseSeries').value;
    var exerciseDropdown = document.getElementById('specificExercise');
    exerciseDropdown.innerHTML = ''; // Clear existing options

    var exercises = {
        'initial': ['Initial Assessment'],
        'flexion': ['RFIL', 'RFIL with overpressure', 'RFIsitting', 'RFIstanding', 'RFIstanding with overpressure'],
        'extension': ['Prone Lying', 'Prone on Elbows', 'REIL', 'REIL with Overpressure', 'REIL w/ clinician overpressure', 'Extension Mobilization'],
        'lateral': ['Side glide in standing', 'Shift Correct'],
        'lateral-rotation': ['Rot in flex', 'Rot in flex mob', 'RFISS']
        // ... other series and exercises ...
    };

    if (series) {
        exercises[series].forEach(function(exercise) {
            var option = document.createElement('option');
            option.value = exercise;
            option.text = exercise;
            exerciseDropdown.appendChild(option);
        });
    } else {
        // If no series is selected, just show the Initial Assessment
        var option = document.createElement('option');
        option.value = 'Initial Assessment';
        option.text = 'Initial Assessment';
        exerciseDropdown.appendChild(option);
    }
}

