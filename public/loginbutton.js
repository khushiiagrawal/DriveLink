import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { app } from "./app.js";

const auth = getAuth(app);

window.logout = function logout() {
    signOut(auth).then(() => {
        // Sign-out successful.
        window.location.href = 'index.html'; // Redirect to login page or home page
    }).catch((error) => {
        // An error happened.
        console.error('Logout error:', error);
    });
}

document.addEventListener("DOMContentLoaded", function () {
    // Submit button
    const loginContainer = document.getElementById('logincnt');
    if (loginContainer) {
        // Listen for authentication state changes
        onAuthStateChanged(auth, (user) => {
            if (user) {
                // User is logged in
                // Get the path from the URL
                const pathname = window.location.pathname;

                // Split the path into parts using '/' as the delimiter
                const pathParts = pathname.split('/');

                // Find the last part that ends with '.html'
                const lastHtmlPath = pathParts.reverse().find(part => part.endsWith('.html'));

                if (lastHtmlPath == "profile.html") {
                    loginContainer.innerHTML = `
                    <button class="nav-link" onclick="logout()">Logout</a>
                    `;
                } else {
                    loginContainer.innerHTML = `
                    <a class="nav-link" href="./profile.html">Your Profile</a>
                    `;
                }
            } else {
                // User is not logged in
                loginContainer.innerHTML = `
                    <a class="nav-link" href="./login.html">Login</a>
                `;
            }
        });
    } else {
        console.error("Login button not found.");
    }
});
