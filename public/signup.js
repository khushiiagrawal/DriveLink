import { getAuth, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { app } from "./app.js";

function isAgeValid(dateOfBirth) {
    // Convert the dateOfBirth to a Date object
    const dob = new Date(dateOfBirth);
    
    // Get the current date
    const today = new Date();
    
    // Calculate the age
    const age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();
    
    // Adjust the age if the birthday has not occurred yet this year
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    
    // Check if the age is between 18 and 72
    return age >= 18 && age < 72;
}

document.addEventListener("DOMContentLoaded", function () {
    // Initialize Firebase
    const auth = getAuth(app);
    const db = getDatabase(app);

    // Check if the user is already logged in
    var unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
            // Show confirmation dialog
            const confirmLogout = window.confirm("You are already logged in. Do you want to logout first?");
            if (confirmLogout) {
                // User chose OK, so sign out
                signOut(auth).then(() => {
                    window.location.href = 'signup.html'; // Redirect to home page after logout
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
            const nameInput = document.getElementById('name');
            const emailInput = document.getElementById('floatingInput');
            const dobInput = document.getElementById('dob');
            const phoneInput = document.getElementById('phone');
            const passwordInput = document.getElementById('floatingPassword');
            const name = nameInput.value;
            const email = emailInput.value;
            const dob = dobInput.value;
            const phone = phoneInput.value;
            const password = passwordInput.value;

            if (!isAgeValid(dob)) {
                alert("You must be older than 18 and younger than 72 to apply for a driving license.");
                return;
            }

            // Get all radio buttons with name 'role'
            const radios = document.querySelectorAll('input[name="role"]');
            
            // Find the checked radio button
            let role;
            for (const radio of radios) {
                if (radio.checked) {
                    role = radio.value; // This gets the value attribute, e.g., 'trainer' or 'learner'
                    break;
                }
            }

            if (!role) {
                alert("Role not selected!");
                return;
            }

            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // Signed in
                    const user = userCredential.user;
                    alert("Account created successfully!");

                    // Save user data to the database
                    const userData = {
                        role: role,
                        name: name,
                        email: email,
                        dob: dob,
                        phone: phone,
                    };
                    
                    // Add the 'verified' field conditionally based on 'isTrainer'
                    if (role == "trainer") {
                        userData.verified = false;
                    }

                    set(ref(db, 'Users/' + user.uid), userData).then(() => {
                        console.log("User data added to database successfully!");
                        window.location.href = 'profile.html';
                    }).catch((error) => {
                        alert("Failed to add user data to database.");
                        console.error(error);
                    });
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    alert(errorMessage);
                    console.error(error);
                });
        });
    } else {
        console.error("Submit button not found.");
    }
});
