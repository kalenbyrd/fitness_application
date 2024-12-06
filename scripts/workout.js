const BASE_URL = "http://127.0.0.1:5000"; // Flask API base URL


// Show the "Add Workout" form when the button is clicked
document.getElementById("show-add-workout-form-btn").addEventListener("click", () => {
    const addWorkoutForm = document.getElementById("add-workout-form");
    addWorkoutForm.style.display = "block"; // Show the form
});

// Close the "Add Workout" form when "Close Form" is clicked
document.getElementById("close-add-workout-form").addEventListener("click", () => {
    const addWorkoutForm = document.getElementById("add-workout-form");
    addWorkoutForm.style.display = "none"; // Hide the form
});

// Add Workout
document.getElementById("add-workout-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id : null;  // Get the user ID from the user object

    if (!user_id) {
        alert("User is not logged in.");
        return;
    }

    // Retrieve workout details from the form
    const workout_type = document.getElementById("workout-type").value;
    const duration = 0;
    const calories_burned = 0;

    try {
        const response = await fetch(`${BASE_URL}/workouts`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, workout_type, duration, calories_burned})
        });

        const result = await response.json();
        if (response.ok) {
            alert("Workout added successfully!");
            document.getElementById("add-workout-form").style.display = "none";  // Hide form after adding workout
        } else {
            alert(`Error adding workout: ${result.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error adding workout:", error);
    }
});


// Fetch Workouts
document.getElementById("workout-id-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));

    const userId = user ? user.user_id : null;

    if (!userId) {
        alert("User is not logged in.");
        return;
    }

    try {
        // Fetch the workouts by user ID from the backend
        const response = await fetch(`${BASE_URL}/workouts/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const workouts = await response.json();

        // Check if workouts were found
        if (workouts.message) {
            alert(workouts.message);
            return;
        }

        // Populate the table with the fetched workouts
        const tableBody = document.getElementById("workouts-table").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = '';  // Clear existing rows

        workouts.forEach(workout => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = workout.workout_id;
            row.insertCell(1).textContent = workout.workout_type;
            row.insertCell(2).textContent = workout.duration;
            row.insertCell(3).textContent = workout.calories_burned;

            // Add actions for edit and delete
            const actionsCell = row.insertCell(4);
            actionsCell.innerHTML = ` 
                <button onclick="editWorkout(${workout.workout_id})">Edit</button>
                <button onclick="deleteWorkout(${workout.workout_id})">Delete</button>
            `;
        });

        document.getElementById("workouts-table").style.display = 'table';

    } catch (error) {
        console.error("Error fetching workouts:", error);
        alert("Failed to fetch workouts.");
    }
});


// Edit Workout (populate the form with workout details)
async function editWorkout(workoutId) {
    const addForm = document.getElementById("add-workout-form");
    const editForm = document.getElementById("update-workout-form");

    // Hide Add Form if it's visible
    if (addForm.style.display === "block") {
        addForm.style.display = "none";
    }

    try {
        // Fetch the workout by its ID
        const response = await fetch(`${BASE_URL}/workout_by_id/${workoutId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const workout = await response.json();

        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user ? user.user_id : null;  // Get the user ID from the user object

        if (!user_id) {
            alert("User is not logged in.");
            return;
        }

        // Populate the Edit Form
        document.getElementById("update-workout-id").value = workout.workout_id || '';
        document.getElementById("update-workout-type").value = workout.workout_type || '';
        document.getElementById("update-workout-duration").value = workout.duration || '';
        document.getElementById("update-workout-calories").value = workout.calories_burned || '';

        editForm.style.display = "block";
    } catch (error) {
        console.error("Error fetching workout data:", error);
        alert("Failed to fetch workout data for editing.");
    }
}



// Update Workout
document.getElementById("update-workout-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const workoutId = document.getElementById("update-workout-id").value.trim();

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id : null;  // Get the user ID from the user object

    if (!user_id) {
        alert("User is not logged in.");
        return;
    }

    const workout_type = document.getElementById("update-workout-type").value.trim();
    

    if (!workoutId) {
        alert("Workout ID is missing. Please try again.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, workout_type }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        alert("Workout updated successfully!");
        document.getElementById("update-workout-form").style.display = "none"; // Hide the form after updating
    } catch (error) {
        console.error("Error updating workout:", error);
        alert("Failed to update workout.");
    }
});

// Close Update Workout Form
document.getElementById("close-update-workout-form").addEventListener("click", () => {
    document.getElementById("update-workout-form").style.display = "none";
});


// Delete Workout
async function deleteWorkout(workoutId) {
    try {
        const response = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
            method: "DELETE"
        });
        const result = await response.json();
        alert("Workout deleted successfully!");
    } catch (error) {
        console.error("Error deleting workout:", error);
    }
};

// Fetch Exercises by Workout ID
document.getElementById("exercise-workout-id-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const workoutId = document.getElementById("workout-id-input").value;

    if (!workoutId) {
        alert("Please enter a workout ID.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/exercises/${workoutId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const exercises = await response.json();

        // Check if exercises were found
        if (exercises.message) {
            alert(exercises.message);
            return;
        }

        // Populate the table with the fetched exercises
        const tableBody = document.getElementById("exercises-table").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ''; // Clear existing rows

        exercises.forEach(exercise => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = exercise.exercise_name;
            row.insertCell(1).textContent = exercise.sets;
            row.insertCell(2).textContent = exercise.reps_per_set;
            row.insertCell(3).textContent = exercise.duration;
            row.insertCell(4).textContent = exercise.calories_burned_per_exercise;

            // Add actions for edit and delete
            const actionsCell = row.insertCell(5);
            actionsCell.innerHTML = `
            <button onclick="editExercise(${exercise.workout_id}, ${exercise.exercise_id})">Edit</button>
            <button onclick="deleteExercise(${exercise.exercise_id})">Delete</button>
        `;
        });

        document.getElementById("exercises-table").style.display = 'table';
        document.getElementById("show-add-exercise-form-btn").style.display = 'inline-block';

    } catch (error) {
        console.error("Error fetching exercises:", error);
        alert("Failed to fetch exercises.");
    }
});

// Show the "Add Workout with Exercises" form
document.getElementById("show-add-workout-with-exercises-form-btn").addEventListener("click", () => {
    document.getElementById("add-workout-with-exercises-form").style.display = "block";
});

// Close the "Add Workout with Exercises" form
document.getElementById("close-workout-with-exercises-form").addEventListener("click", () => {
    document.getElementById("add-workout-with-exercises-form").style.display = "none";
});



//add workout with exercises
document.getElementById("add-workout-with-exercises-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id : null;  // Get the user ID from the user object

    if (!user_id) {
        alert("User is not logged in.");
        return;
    }

    // Collect workout details
    const workout_type = document.getElementById("transaction-workout-type").value;
    const duration = 0;
    const calories_burned = 0;


    // Collect exercises
    const exercises = [];
    const exerciseEntries = document.querySelectorAll(".exercise-entry");
    exerciseEntries.forEach((entry) => {
        const exercise_name = entry.querySelector(".transaction-exercise-name").value;
        const sets = entry.querySelector(".transaction-exercise-sets").value;
        const reps_per_set = entry.querySelector(".transaction-exercise-reps").value;
        const exercise_duration = entry.querySelector(".transaction-exercise-duration").value;
        const calories_burned_per_exercise = entry.querySelector(".transaction-exercise-calories").value;

        // Validate exercise details
        if (!exercise_name || !sets || !reps_per_set || !exercise_duration || !calories_burned_per_exercise) {
            alert("Please fill in all exercise details.");
            return;
        }

        exercises.push({
            exercise_name,
            sets,
            reps_per_set,
            duration: exercise_duration,
            calories_burned_per_exercise
        });
    });

    // Prepare data for POST request
    const payload = {
        user_id,
        workout_details: { workout_type, duration, calories_burned },
        exercises
    };

    try {
        // Send POST request to backend
        const response = await fetch(`${BASE_URL}/workouts_with_exercises`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload)
        });

        const result = await response.json();
        if (response.ok) {
            alert("Workout with exercises added successfully!");
            document.getElementById("add-workout-with-exercises-form").reset(); // Reset the form
            document.getElementById("add-workout-with-exercises-form").style.display = "none"; // Hide form
        } else {
            alert(`Error: ${result.error}`);
        }
    } catch (error) {
        console.error("Error adding workout with exercises:", error);
        alert("Failed to add workout with exercises.");
    }
});



// Show the "Add Exercise" form
document.getElementById("show-add-exercise-form-btn").addEventListener("click", () => {
    const addExerciseForm = document.getElementById("add-exercise-form");
    addExerciseForm.style.display = "block";
});

// Close the "Add Exercise" form
document.getElementById("close-add-exercise-form").addEventListener("click", () => {
    const addExerciseForm = document.getElementById("add-exercise-form");
    addExerciseForm.style.display = "none";
});

// Add Exercise
document.getElementById("add-exercise-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const workout_id = document.getElementById("exercise-workout-id").value;
    const exercise_name = document.getElementById("exercise-name").value;
    const sets = document.getElementById("exercise-sets").value;
    const reps_per_set = document.getElementById("exercise-reps").value;
    const duration = document.getElementById("exercise-duration").value;
    const calories_burned_per_exercise = document.getElementById("exercise-calories").value;

    try {
        const response = await fetch(`${BASE_URL}/exercises`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workout_id, exercise_name, sets, reps_per_set, duration, calories_burned_per_exercise })
        });
        const result = await response.json();
        if (response.ok) {
            alert("Exercise added successfully!");
            document.getElementById("add-exercise-form").style.display = "none"; // Hide form after adding
        } else {
            alert(`Error adding exercise: ${result.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error adding exercise:", error);
    }
});

// Edit Exercise
async function editExercise(workoutId, exerciseId) {
    const addForm = document.getElementById("add-exercise-form");
    const editForm = document.getElementById("update-exercise-form");

    // Hide Add Form if it's visible
    if (addForm.style.display === "block") {
        addForm.style.display = "none";
    }

    try {
        // Fetch all exercises for the specified workout
        const response = await fetch(`${BASE_URL}/exercises/${workoutId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const exercises = await response.json();

        // Find the exercise object by its ID
        const exercise = exercises.find(ex => ex.exercise_id === exerciseId);

        if (!exercise) {
            alert("Exercise not found.");
            return;
        }

        // Populate the form fields
        document.getElementById("update-exercise-id").value = exercise.exercise_id;
        document.getElementById("update-exercise-workout-id").value = exercise.workout_id;
        document.getElementById("update-exercise-name").value = exercise.exercise_name;
        document.getElementById("update-exercise-sets").value = exercise.sets;
        document.getElementById("update-exercise-reps").value = exercise.reps_per_set;
        document.getElementById("update-exercise-duration").value = exercise.duration;
        document.getElementById("update-exercise-calories").value = exercise.calories_burned_per_exercise;

        // Show the Edit Exercise Form
        editForm.style.display = "block";
    } catch (error) {
        console.error("Error fetching exercise data:", error);
        alert("Failed to fetch exercise data for editing.");
    }
}

// Update Exercise
document.getElementById("update-exercise-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const exerciseId = document.getElementById("update-exercise-id").value;
    const workout_id = document.getElementById("update-exercise-workout-id").value;
    const exercise_name = document.getElementById("update-exercise-name").value;
    const sets = document.getElementById("update-exercise-sets").value;
    const reps_per_set = document.getElementById("update-exercise-reps").value;
    const duration = document.getElementById("update-exercise-duration").value;
    const calories_burned_per_exercise = document.getElementById("update-exercise-calories").value;

    try {
        const response = await fetch(`${BASE_URL}/exercises/${exerciseId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ workout_id, exercise_name, sets, reps_per_set, duration, calories_burned_per_exercise })
        });
        const result = await response.json();
        alert("Exercise updated successfully!");
        document.getElementById("update-exercise-form").style.display = "none"; // Hide form
    } catch (error) {
        console.error("Error updating exercise:", error);
    }
});

// Close Update exercise Form
document.getElementById("close-update-exercise-form").addEventListener("click", () => {
    document.getElementById("update-exerciset-form").style.display = "none";
});

// Delete Exercise
async function deleteExercise(exerciseId) {
    try {
        const response = await fetch(`${BASE_URL}/exercises/${exerciseId}`, {
            method: "DELETE"
        });
        const result = await response.json();
        alert("Exercise deleted successfully!");
    } catch (error) {
        console.error("Error deleting exercise:", error);
    }
};
