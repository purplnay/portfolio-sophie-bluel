/**
 * The URL to the API.
 */
const API = "http://localhost:5678/api";

/**
 * The ID of the user or `null` if not connected.
 */
let userId = localStorage.getItem("userId");

/**
 * The token for the user or `null` if not connected.
 */
let token = localStorage.getItem("token");

document.addEventListener("DOMContentLoaded", () => {
    // Set up the auth
    const logoutEl = document.querySelector(".nav-logout");

    // Set is-authenticated if user is authenticated
    if (userId && token) {
        document.body.classList.add("is-authenticated");

        // Log out when the log out link is clicked
        logoutEl.addEventListener("click", () => {
            localStorage.clear();
            userId = null;
            token = null;
            document.body.classList.remove("is-authenticated");
        });
    }
});

const isAuthenticated = () =>
    document.body.classList.contains("is-authenticated");
