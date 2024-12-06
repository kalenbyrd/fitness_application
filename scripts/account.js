const BASE_URL = "http://127.0.0.1:5000"; // Flask API base URL


// Fetch user details from API and display them
document.addEventListener("DOMContentLoaded", async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.user_id : null;

    if (!userId) {
        alert("User not logged in!");
        window.location.href = "/login"; // Redirect to login page if user is not logged in
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`);
        if (response.ok) {
            const userData = await response.json();
            // Populate the account information
            document.getElementById("user-email").textContent = userData.email;
            document.getElementById("user-name").textContent = userData.name;
            document.getElementById("user-age").textContent = userData.age;
            document.getElementById("user-height").textContent = userData.height;
            document.getElementById("user-weight").textContent = userData.weight;
        } else {
            alert("Failed to load user data.");
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        alert("An error occurred while fetching user data.");
    }
});

// Handle form submission for updating user details
document.getElementById("update-account-form").addEventListener("submit", async (e) => {
    e.preventDefault();

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user ? user.user_id : null;

    if (!userId) {
        alert("User not logged in!");
        window.location.href = "/login"; // Redirect to login if not logged in
        return;
    }

    const updatedData = {
        email: document.getElementById("update-email").value,
        name: document.getElementById("update-name").value,
        age: document.getElementById("update-age").value,
        height: document.getElementById("update-height").value,
        weight: document.getElementById("update-weight").value
    };

    try {
        const response = await fetch(`${BASE_URL}/users/${userId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(updatedData)
        });

        const result = await response.json();

        if (response.ok) {
            alert("User details updated successfully!");
            window.location.reload(); // Reload the page to fetch and display updated information
        } else {
            alert(`Error updating user: ${result.message}`);
        }
    } catch (error) {
        console.error("Error updating user data:", error);
        alert("An error occurred while updating user data.");
    }
});

document.getElementById("logout").addEventListener("click", (e) => {
    e.preventDefault();
    localStorage.removeItem("user");  // Clear user data from localStorage
    window.location.href = "signin.html";  // Redirect to login page
});
