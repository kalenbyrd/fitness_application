const BASE_URL = "http://127.0.0.1:5000"; // Flask API base URL

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
