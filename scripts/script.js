const BASE_URL = "http://127.0.0.1:5000"; // Flask API base URL

// Fetch Users
document.getElementById("fetch-users").addEventListener("click", async () => {
    try {
        const response = await fetch(`${BASE_URL}/users`);
        const users = await response.json();

        // Populate the table with the fetched users
        const tableBody = document.getElementById("users-table").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = '';  // Clear existing rows

        users.forEach(user => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = user.user_id;
            row.insertCell(1).textContent = user.name;
            row.insertCell(2).textContent = user.email;
            row.insertCell(3).textContent = user.age;
            row.insertCell(4).textContent = user.height;
            row.insertCell(5).textContent = user.weight;
            row.insertCell(6).textContent = new Date(user.created_at).toLocaleString();
            row.insertCell(7).textContent = new Date(user.updated_at).toLocaleString();
            
            // Add action buttons for update and delete
            const actionsCell = row.insertCell(8);
            actionsCell.innerHTML = `
                <button onclick="editUser(${user.user_id})">Edit</button>
                <button onclick="deleteUser(${user.user_id})">Delete</button>
            `;
        });

        // Display the table and the Add User button
        document.getElementById("users-table").style.display = 'table';
        document.getElementById("toggle-add-form").style.display = 'inline-block';

    } catch (error) {
        console.error("Error fetching users:", error);
    }
});

// Toggle the Add User Form
document.getElementById("toggle-add-form").addEventListener("click", () => {
    const addForm = document.getElementById("add-user-form");
    const editForm = document.getElementById("update-user-form");

    // Hide Edit Form if it's visible
    if (editForm.style.display === "block") {
        editForm.style.display = "none";
    }

    // Toggle visibility of the Add User Form
    if (addForm.style.display === "none" || addForm.style.display === "") {
        addForm.style.display = "block";
        document.getElementById("toggle-add-form").textContent = "Close Form";
    } else {
        addForm.style.display = "none";
        document.getElementById("toggle-add-form").textContent = "Add User";
    }
});

// Close the Add User Form
document.getElementById("close-add-form").addEventListener("click", () => {
    document.getElementById("add-user-form").style.display = "none";
    document.getElementById("toggle-add-form").textContent = "Add User";
});

// Add User
document.getElementById("add-user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("user-email").value;
    const name = document.getElementById("user-name").value;
    const age = document.getElementById("user-age").value;
    const height = document.getElementById("user-height").value;
    const weight = document.getElementById("user-weight").value;

    try {
        const response = await fetch(`${BASE_URL}/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, age, height, weight })
        });
        const result = await response.json();
        if (response.ok) {
            alert("User added successfully!");
            document.getElementById("add-user-form").style.display = "none"; // Hide form after adding user
            document.getElementById("toggle-add-form").textContent = "Add User"; // Reset button text
        } else {
            // Show error message from server response
            alert(`Error adding user: ${result.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error adding user:", error);
    }
});

// Edit User (populate the form with user details)
async function editUser(userId) {
    const addForm = document.getElementById("add-user-form");
    const editForm = document.getElementById("update-user-form");

    // Hide Add Form if it's visible
    if (addForm.style.display === "block") {
        addForm.style.display = "none";
    }

    try {
        // Fetch the user data from the API
        const response = await fetch(`${BASE_URL}/users/${userId}`);
        const user = await response.json();

        // Pre-fill the Edit User Form with the fetched user data
        document.getElementById("update-user-id").value = user.user_id;  // User ID is readonly
        document.getElementById("update-user-email").value = user.email;
        document.getElementById("update-user-name").value = user.name;
        document.getElementById("update-user-age").value = user.age;
        document.getElementById("update-user-height").value = user.height;
        document.getElementById("update-user-weight").value = user.weight;

        // Show the Edit User Form
        editForm.style.display = "block";
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user data for editing.");
    }
}

// Close the Edit User Form
document.getElementById("close-edit-form").addEventListener("click", () => {
    document.getElementById("update-user-form").style.display = "none";
});

// Update User
document.getElementById("update-user-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const userId = document.getElementById("update-user-id").value;
    const email = document.getElementById("update-user-email").value;
    const name = document.getElementById("update-user-name").value;
    const age = document.getElementById("update-user-age").value;
    const height = document.getElementById("update-user-height").value;
    const weight = document.getElementById("update-user-weight").value;

    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, name, age, height, weight })
        });
        const result = await response.json();
        alert("User updated successfully!");
        document.getElementById("update-user-form").style.display = "none";  // Hide form after updating user
    } catch (error) {
        console.error("Error updating user:", error);
    }
});

// Delete User
async function deleteUser(userId) {
    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: "DELETE"
        });
        const result = await response.json();
        alert("User deleted successfully!");
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};

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
    const duration = document.getElementById("update-workout-duration").value.trim();
    const calories_burned = document.getElementById("update-workout-calories").value.trim();

    if (!workoutId) {
        alert("Workout ID is missing. Please try again.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/workouts/${workoutId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, workout_type, duration, calories_burned }),
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
            row.insertCell(0).textContent = exercise.exercise_id;
            row.insertCell(1).textContent = exercise.exercise_name;
            row.insertCell(2).textContent = exercise.sets;
            row.insertCell(3).textContent = exercise.reps_per_set;
            row.insertCell(4).textContent = exercise.duration;
            row.insertCell(5).textContent = exercise.calories_burned_per_exercise;

            // Add actions for edit and delete
            const actionsCell = row.insertCell(6);
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

// Add exercise
document.getElementById("add-exercise-entry").addEventListener("click", () => {
    const container = document.getElementById("transaction-exercises-container");

    // Create a new exercise entry block
    const exerciseEntry = document.createElement("div");
    exerciseEntry.classList.add("exercise-entry");
    exerciseEntry.innerHTML = `
        <input type="text" class="transaction-exercise-name" placeholder="Exercise Name">
        <input type="number" class="transaction-exercise-sets" placeholder="Sets">
        <input type="number" class="transaction-exercise-reps" placeholder="Reps Per Set">
        <input type="number" class="transaction-exercise-duration" placeholder="Duration (minutes)">
        <input type="number" class="transaction-exercise-calories" placeholder="Calories Burned">
    `;

    container.appendChild(exerciseEntry);
});

document.getElementById("add-workout-with-exercises-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect workout details
    const user_id = document.getElementById("transaction-workout-user-id").value;
    const workout_type = document.getElementById("transaction-workout-type").value;
    const duration = document.getElementById("transaction-workout-duration").value;
    const calories_burned = document.getElementById("transaction-workout-calories").value;

    // Collect exercises
    const exercises = [];
    const exerciseEntries = document.querySelectorAll(".exercise-entry");
    exerciseEntries.forEach((entry) => {
        const exercise_name = entry.querySelector(".transaction-exercise-name").value;
        const sets = entry.querySelector(".transaction-exercise-sets").value;
        const reps_per_set = entry.querySelector(".transaction-exercise-reps").value;
        const duration = entry.querySelector(".transaction-exercise-duration").value;
        const calories_burned_per_exercise = entry.querySelector(".transaction-exercise-calories").value;

        exercises.push({ exercise_name, sets, reps_per_set, duration, calories_burned_per_exercise });
    });

    try {
        // Send POST request
        const response = await fetch(`${BASE_URL}/workouts_with_exercises`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id,
                workout_details: { workout_type, duration, calories_burned},
                exercises,
            }),
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

// Show Add Diet Form
document.getElementById("show-add-diet-form-btn").addEventListener("click", () => {
    document.getElementById("add-diet-form").style.display = "block";
});

// Close Add Diet Form
document.getElementById("close-add-diet-form").addEventListener("click", () => {
    document.getElementById("add-diet-form").style.display = "none";
});

// Close Update Diet Form
document.getElementById("close-update-diet-form").addEventListener("click", () => {
    document.getElementById("update-diet-form").style.display = "none";
});


// Fetch diet entries
document.getElementById("diet-user-id-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));  // Use "user" from localStorage

    const userId = user ? user.user_id : null;  // Get the user ID from the user object

    if (!userId) {
        alert("User is not logged in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/diet/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dietEntries = await response.json();

        // Check if diet entries were found
        if (dietEntries.message) {
            alert(dietEntries.message);
            return;
        }

        // Populate the table with the fetched diet entries
        const tableBody = document.getElementById("diet-table").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ''; // Clear existing rows

        dietEntries.forEach(entry => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = entry.meal_type;
            row.insertCell(1).textContent = entry.calories;
            row.insertCell(2).textContent = entry.protein; // Display protein value
            row.insertCell(3).textContent = entry.carbs;   // Display carbs value
            row.insertCell(4).textContent = entry.fats;    // Display fats value

            // Add actions for edit and delete
            const actionsCell = row.insertCell(5);
            actionsCell.innerHTML = `
                <button onclick="editDiet(${entry.diet_id})">Edit</button>
                <button onclick="deleteDiet(${entry.diet_id})">Delete</button>
            `;
        });

        document.getElementById("diet-table").style.display = 'table';
        document.getElementById("show-add-diet-form-btn").style.display = 'inline-block';

    } catch (error) {
        console.error("Error fetching diet entries:", error);
        alert("Failed to fetch diet entries.");
    }
});


//add diet
document.getElementById("add-diet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user")); // Fetch the user object from localStorage
    const user_id = user ? user.user_id : null; // Use the user_id from the stored user data

    // Check if user_id is available
    if (!user_id) {
        alert("User is not logged in.");
        return;
    }

    // Get the values from the form
    const meal_type = document.getElementById("diet-meal-type").value;
    const calories = parseFloat(document.getElementById("diet-calories").value);
    const protein = parseFloat(document.getElementById("diet-protein").value) || 0;  // Default to 0 if not provided
    const carbs = parseFloat(document.getElementById("diet-carbs").value) || 0;  // Default to 0 if not provided
    const fats = parseFloat(document.getElementById("diet-fats").value) || 0;  // Default to 0 if not provided

    // Validate the inputs (e.g., non-negative numbers)
    if (isNaN(calories) || calories < 0) {
        alert("Please enter a valid non-negative number for calories.");
        return;
    }

    if (isNaN(protein) || protein < 0) {
        alert("Please enter a valid non-negative number for protein.");
        return;
    }

    if (isNaN(carbs) || carbs < 0) {
        alert("Please enter a valid non-negative number for carbs.");
        return;
    }

    if (isNaN(fats) || fats < 0) {
        alert("Please enter a valid non-negative number for fats.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/diet`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, meal_type, calories, protein, carbs, fats })
        });

        const result = await response.json();

        if (response.ok) {
            alert("Diet entry added successfully!");
            document.getElementById("add-diet-form").style.display = "none"; // Hide form after adding
        } else {
            alert(`Error adding diet: ${result.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error adding diet entry:", error);
        alert("An error occurred. Please try again later.");
    }
});


async function editDiet(dietId) {
    const addForm = document.getElementById("add-diet-form");
    const editForm = document.getElementById("update-diet-form");

    // Hide Add Form if it's visible
    if (addForm.style.display === "block") {
        addForm.style.display = "none";
    }

    try {
        const response = await fetch(`${BASE_URL}/diet_by_id/${dietId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const dietEntries = await response.json();

        // Find the diet entry object by its ID
        const dietEntry = Array.isArray(dietEntries)
            ? dietEntries.find(entry => entry.diet_id === dietId)
            : dietEntries;

        if (!dietEntry) {
            alert("Diet entry not found.");
            return;
        }

        // Populate the form fields
        document.getElementById("update-diet-id").value = dietEntry.diet_id || '';
        document.getElementById("update-diet-user-id").value = dietEntry.user_id || '';  // Still populated for reference
        document.getElementById("update-diet-meal-type").value = dietEntry.meal_type || '';
        document.getElementById("update-diet-calories").value = dietEntry.calories || '';
        document.getElementById("update-diet-protein").value = dietEntry.protein || '';
        document.getElementById("update-diet-carbs").value = dietEntry.carbs || '';
        document.getElementById("update-diet-fats").value = dietEntry.fats || '';

        // Show the Edit Diet Form
        editForm.style.display = "block";
    } catch (error) {
        console.error("Error fetching diet data:", error);
        alert("Failed to fetch diet entry for editing.");
    }
}



document.getElementById("update-diet-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const dietId = document.getElementById("update-diet-id").value;
    const user_id = document.getElementById("update-diet-user-id").value;
    const meal_type = document.getElementById("update-diet-meal-type").value;
    const calories = document.getElementById("update-diet-calories").value;
    const protein = document.getElementById("update-diet-protein").value;
    const carbs = document.getElementById("update-diet-carbs").value;
    const fats = document.getElementById("update-diet-fats").value;

    try {
        const response = await fetch(`${BASE_URL}/diet/${dietId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, meal_type, calories, protein, carbs, fats })
        });
        const result = await response.json();
        alert("Diet entry updated successfully!");
        document.getElementById("update-diet-form").style.display = "none"; // Hide form
    } catch (error) {
        console.error("Error updating diet entry:", error);
    }
});


async function deleteDiet(dietId) {
    try {
        const response = await fetch(`${BASE_URL}/diet/${dietId}`, {
            method: "DELETE"
        });
        const result = await response.json();
        alert("Diet entry deleted successfully!");
    } catch (error) {
        console.error("Error deleting diet entry:", error);
    }
};

// Fetch Goals
document.getElementById("goal-user-id-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));  // Use "user" from localStorage

    const userId = user ? user.user_id : null;  // Get the user ID from the user object

    if (!userId) {
        alert("User is not logged in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/goals/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const goals = await response.json();

        // Check if goals were found
        if (goals.message) {
            alert(goals.message);
            return;
        }

        // Populate the table with the fetched goals
        const tableBody = document.getElementById("goals-table").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ''; // Clear existing rows

        goals.forEach(goal => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = goal.goal_type;
            row.insertCell(1).textContent = goal.target_value;
            row.insertCell(2).textContent = goal.current_progress;
            row.insertCell(3).textContent = goal.deadline;
            row.insertCell(4).textContent = goal.status;

            // Add actions for edit and delete
            const actionsCell = row.insertCell(5);
            actionsCell.innerHTML = `
                <button onclick="editGoal(${goal.goal_id})">Edit</button>
                <button onclick="deleteGoal(${goal.goal_id})">Delete</button>
            `;
        });

        document.getElementById("goals-table").style.display = 'table';
        document.getElementById("show-add-goal-form-btn").style.display = 'inline-block';

    } catch (error) {
        console.error("Error fetching goals:", error);
        alert("Failed to fetch goals.");
    }
});


// Show Add Goal Form
document.getElementById("show-add-goal-form-btn").addEventListener("click", () => {
    const addGoalForm = document.getElementById("add-goal-form");
    addGoalForm.style.display = "block"; // Show the form
});

// Close Add Goal Form
document.getElementById("close-add-goal-form").addEventListener("click", () => {
    const addGoalForm = document.getElementById("add-goal-form");
    addGoalForm.style.display = "none"; // Hide the form
});

// Add Goal
document.getElementById("add-goal-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id : null;  // Get the user ID from the user object

    if (!user_id) {
        alert("User is not logged in.");
        return;
    }

    const goal_type = document.getElementById("goal-type").value;
    const target_value = document.getElementById("goal-target-value").value;
    const current_progress = document.getElementById("goal-current-progress").value;
    const deadline = document.getElementById("goal-deadline").value;
    const status = document.getElementById("goal-status").value;

    try {
        const response = await fetch(`${BASE_URL}/goals`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, goal_type, target_value, current_progress, deadline, status })
        });
        const result = await response.json();
        if (response.ok) {
            alert("Goal added successfully!");
            document.getElementById("add-goal-form").style.display = "none"; // Hide form after adding
        } else {
            alert(`Error adding goal: ${result.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error adding goal:", error);
    }
});


// Edit Goal
async function editGoal(goalId) {
    const addForm = document.getElementById("add-goal-form");
    const editForm = document.getElementById("update-goal-form");

    // Hide Add Form if it's visible
    if (addForm.style.display === "block") {
        addForm.style.display = "none";
    }

    try {
        // Fetch goal by ID
        const response = await fetch(`${BASE_URL}/goal_by_id/${goalId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const goal = await response.json();

        if (!goal) {
            alert("Goal not found.");
            return;
        }

        // Get user data from localStorage
        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user ? user.user_id : null;  // Get the user ID from the user object

        if (!user_id) {
            alert("User is not logged in.");
            return;
        }

        // Populate the form with goal data
        
        document.getElementById("update-goal-id").value = goal.goal_id || ''; // Populate goal ID for updating
        document.getElementById("update-goal-type").value = goal.goal_type || '';
        document.getElementById("update-goal-target-value").value = goal.target_value || '';
        document.getElementById("update-goal-current-progress").value = goal.current_progress || '';
        document.getElementById("update-goal-deadline").value = goal.deadline || '';
        document.getElementById("update-goal-status").value = goal.status || '';

    

        editForm.style.display = "block";
    } catch (error) {
        console.error("Error fetching goal data:", error);
        alert("Failed to fetch goal for editing.");
    }
}



// Close Update Goal Form
document.getElementById("close-update-goal-form").addEventListener("click", () => {
    const updateGoalForm = document.getElementById("update-goal-form");
    updateGoalForm.style.display = "none"; // Hide the form
});

// Update Goal
document.getElementById("update-goal-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get the goal_id from the form
    const goal_id = document.getElementById("update-goal-id").value;  // Assuming there's an input with this id
    if (!goal_id) {
        alert("Goal ID is missing. Please try again.");
        return;
    }

    // Get the user_id from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id : null;  // Get the user ID from the user object

    if (!user_id) {
        alert("User is not logged in.");
        return;
    }

    // Get goal data from form
    const goal_type = document.getElementById("update-goal-type").value;
    const target_value = document.getElementById("update-goal-target-value").value;
    const current_progress = document.getElementById("update-goal-current-progress").value;
    const deadline = document.getElementById("update-goal-deadline").value;
    const status = document.getElementById("update-goal-status").value;

    try {
        const response = await fetch(`${BASE_URL}/goals/${goal_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, goal_type, target_value, current_progress, deadline, status })
        });

        const result = await response.json();
        if (response.ok) {
            alert("Goal updated successfully!");
            document.getElementById("update-goal-form").style.display = "none"; // Hide form after updating
        } else {
            alert(`Error updating goal: ${result.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error updating goal:", error);
    }
});



// Delete Goal
async function deleteGoal(goalId) {
    try {
        const response = await fetch(`${BASE_URL}/goals/${goalId}`, {
            method: "DELETE"
        });
        const result = await response.json();
        alert("Goal deleted successfully!");
    } catch (error) {
        console.error("Error deleting goal:", error);
    }
};

// Fetch Progress
document.getElementById("progress-user-id-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user data from localStorage
    const user = JSON.parse(localStorage.getItem("user"));  // Use "user" from localStorage

    const userId = user ? user.user_id : null;  // Get the user ID from the user object

    if (!userId) {
        alert("User is not logged in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/progress/${userId}`);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const progressEntries = await response.json();

        if (progressEntries.message) {
            alert(progressEntries.message);
            return;
        }

        const tableBody = document.getElementById("progress-table").getElementsByTagName("tbody")[0];
        tableBody.innerHTML = ''; // Clear existing rows

        progressEntries.forEach((progress) => {
            const row = tableBody.insertRow();
            row.insertCell(0).textContent = progress.weight;
            row.insertCell(1).textContent = progress.workout_count;
            row.insertCell(2).textContent = progress.calories_burned;
            row.insertCell(3).textContent = new Date(progress.date).toLocaleDateString();

            const actionsCell = row.insertCell(4);
            actionsCell.innerHTML = `
                <button onclick="editProgress(${progress.progress_id})">Edit</button>
                <button onclick="deleteProgress(${progress.progress_id})">Delete</button>
            `;
        });

        document.getElementById("progress-table").style.display = "table";
        document.getElementById("show-add-progress-form-btn").style.display = "inline-block";
    } catch (error) {
        console.error("Error fetching progress:", error);
        alert("Failed to fetch progress.");
    }
});


// Show the "Add Progress" form
document.getElementById("show-add-progress-form-btn").addEventListener("click", () => {
    document.getElementById("add-progress-form").style.display = "block";
});

// Close the "Add Progress" form
document.getElementById("close-add-progress-form").addEventListener("click", () => {
    document.getElementById("add-progress-form").style.display = "none";
});

// Add Progress
document.getElementById("add-progress-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Get user_id from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id : null;  // Get the user ID from the user object

    if (!user_id) {
        alert("User is not logged in.");
        return;
    }

    const weight = document.getElementById("progress-weight").value;
    const workout_count = document.getElementById("progress-workout-count").value;
    const calories_burned = document.getElementById("progress-calories-burned").value;
    const date = document.getElementById("progress-date").value;

    try {
        const response = await fetch(`${BASE_URL}/progress`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, weight, workout_count, calories_burned, date, goal_id }),
        });

        const result = await response.json();
        if (response.ok) {
            alert("Progress entry added successfully!");
            document.getElementById("add-progress-form").style.display = "none";  // Hide form after adding progress
        } else {
            alert(`Error adding progress: ${result.error || "Unknown error"}`);
        }
    } catch (error) {
        console.error("Error adding progress:", error);
    }
});


// Edit Progress
async function editProgress(progressId) {
    const addForm = document.getElementById("add-progress-form");
    const editForm = document.getElementById("update-progress-form");

    // Hide Add Form if it's visible
    if (addForm.style.display === "block") {
        addForm.style.display = "none";
    }

    try {
        const response = await fetch(`${BASE_URL}/progress_by_id/${progressId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const progressArray = await response.json();
        const progress = Array.isArray(progressArray) 
            ? progressArray.find((p) => p.progress_id === progressId) 
            : progressArray;

        if (!progress) {
            alert("Progress not found.");
            return;
        }

        // Populate the Edit Form with the progress details
        document.getElementById("update-progress-id").value = progress.progress_id;
        document.getElementById("update-progress-weight").value = progress.weight;
        document.getElementById("update-progress-workout-count").value = progress.workout_count;
        document.getElementById("update-progress-calories-burned").value = progress.calories_burned;
        document.getElementById("update-progress-date").value = new Date(progress.date).toISOString().split("T")[0];

        // Set user_id and goal_id from localStorage (user is logged in)
        const user = JSON.parse(localStorage.getItem("user"));
        const user_id = user ? user.user_id : null;
        const goal_id = progress.goal_id;  // Pre-populate goal_id from the existing progress

        if (!user_id) {
            alert("User is not logged in.");
            return;
        }

        

        editForm.style.display = "block";
    } catch (error) {
        console.error("Error fetching progress data:", error);
        alert("Failed to fetch progress entry for editing.");
    }
}


// Update Progress
document.getElementById("update-progress-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const progress_id = document.getElementById("update-progress-id").value;

    // Get user_id from localStorage
    const user = JSON.parse(localStorage.getItem("user"));
    const user_id = user ? user.user_id : null;  // Get the user ID from the user object
    const weight = document.getElementById("update-progress-weight").value;
    const workout_count = document.getElementById("update-progress-workout-count").value;
    const calories_burned = document.getElementById("update-progress-calories-burned").value;
    const date = document.getElementById("update-progress-date").value;

    if (!user_id) {
        alert("User is not logged in.");
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/progress/${progress_id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, weight, workout_count, calories_burned, date}),
        });

        const result = await response.json();
        alert("Progress entry updated successfully!");
        document.getElementById("update-progress-form").style.display = "none";  // Hide form after updating
    } catch (error) {
        console.error("Error updating progress:", error);
    }
});

// Close Update Progress Form
document.getElementById("close-update-progress-form").addEventListener("click", () => {
    const updateProgressForm = document.getElementById("update-progress-form");
    updateProgressForm.style.display = "none"; // Hide the form
});


// Delete Progress
async function deleteProgress(progressId) {
    try {
        const response = await fetch(`${BASE_URL}/progress/${progressId}`, {
            method: "DELETE",
        });
        const result = await response.json();
        alert("Progress entry deleted successfully!");
    } catch (error) {
        console.error("Error deleting progress entry:", error);
    }
}
















