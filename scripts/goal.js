const BASE_URL = "http://127.0.0.1:5000"; // Flask API base URL

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