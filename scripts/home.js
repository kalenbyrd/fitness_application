const BASE_URL = "http://127.0.0.1:5000"; // Flask API base URL

document.getElementById("logout").addEventListener("click", () => {
    // Clear user data from localStorage or sessionStorage
    localStorage.removeItem("user");  // or sessionStorage.removeItem("user");

    // Redirect to the login page
    window.location.href = "signin.html";  // Adjust this to the actual URL of your login page
});
