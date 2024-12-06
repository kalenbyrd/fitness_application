const BASE_URL = "http://127.0.0.1:5000"; // Flask API base URL



document.addEventListener("DOMContentLoaded", function() {
    const signupForm = document.getElementById("signupForm");
    const loginForm = document.getElementById("loginForm");

    if (signupForm) {
        signupForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const formData = {
                email: document.getElementById("email").value,
                name: document.getElementById("name").value,
                age: document.getElementById("age").value,
                height: document.getElementById("height").value,
                weight: document.getElementById("weight").value,
                password: document.getElementById("password").value,
            };

            try {
                const response = await fetch(`${BASE_URL}/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Signup successful!");
                    window.location.href = "signin.html"; // Redirect to login page
                } else {
                    alert(result.error || "Signup failed");
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred. Please try again later.");
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener("submit", async function (e) {
            e.preventDefault();

            const formData = {
                email: document.getElementById("email").value,
                password: document.getElementById("password").value,
            };

            try {
                const response = await fetch(`${BASE_URL}/login`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                });

                const result = await response.json();
                if (response.ok) {
                    alert("Login successful!");
                    localStorage.setItem("user", JSON.stringify(result.user));
                    window.location.href = "homepage.html"; // Redirect to dashboard
                } else {
                    alert(result.error || "Login failed");
                }
            } catch (error) {
                console.error(error);
                alert("An error occurred. Please try again later.");
            }
        });
    }
    
});
