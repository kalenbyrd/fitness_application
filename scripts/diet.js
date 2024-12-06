const BASE_URL = "http://127.0.0.1:5000"; // Flask API base URL


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


            const formattedDate = new Date(entry.date).toLocaleString();
            row.insertCell(5).textContent = formattedDate
            // Add actions for edit and delete
            const actionsCell = row.insertCell(6);
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
    const date = parseFloat(document.getElementById("diet-date").value) || 0; // Get the date value

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
            body: JSON.stringify({ user_id, meal_type, calories, protein, carbs, fats, date })
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
    const date = document.getElementById("update-diet-date").value; // Get the date value

    try {
        const response = await fetch(`${BASE_URL}/diet/${dietId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id, meal_type, calories, protein, carbs, fats, date })
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