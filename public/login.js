import { getAuth, onAuthStateChanged, signOut, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { app } from "./app.js";

document.addEventListener("DOMContentLoaded", function () {
    const auth = getAuth(app);

    // Check if the user is already logged in
    var unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // Show confirmation dialog
            const confirmLogout = window.confirm("You are already logged in. Do you want to logout first?");
            if (confirmLogout) {
                // User chose OK, so sign out
                signOut(auth).then(() => {
                    window.location.href = 'login.html'; // Redirect to home page after logout
                }).catch((error) => {
                    console.error('Logout error:', error);
                });
            } else {
                // User chose Cancel, go back to the previous page
                window.history.back();
            }
        }
    });

    // Submit button
    const submitButton = document.getElementById('submit');
    if (submitButton) {
        submitButton.addEventListener("click", function (event) {
            unsubscribe();
            event.preventDefault();

            // Inputs
            const emailInput = document.getElementById('floatingInput');
            const passwordInput = document.getElementById('floatingPassword');
            const email = emailInput.value;
            const password = passwordInput.value;

            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in 
                    const user = userCredential.user;
                    alert("Sign in successful!");
                    console.log(user);
                    window.location.href = 'profile.html';
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    alert("Sign in failed: " + errorMessage);
                    console.error(error);
                });
        });
    } else {
        console.error("Submit button not found.");
    }
});
