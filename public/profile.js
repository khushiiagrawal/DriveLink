// Import the necessary functions from the Firebase modules
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, get } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { app } from "./app.js"

document.addEventListener("DOMContentLoaded", function () {
    // Check if the user is logged in
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
        if (!user) {
            alert("Error: Not logged in!")
            window.history.back();
        }
        // Get the database
        const database = getDatabase(app);

        // Reference to the user
        const userRef = ref(database, 'Users/' + user.uid);

        get(userRef).then((snapshot) => {
            const infoContainer = document.getElementById('info-container');
            if (snapshot.exists()) {
                const userData = snapshot.val();
                let htmlContent = `
                    <h1>${userData.name}</h1>
                    <p>Role: ${userData.role}</p><br>
                    <p>Email: <a href="mailto:${userData.email}">${userData.email}</a></p>
                    <p>Phone: <a href="tel:${userData.phone}">${userData.phone}</a></p>
                `;

                let pfp = "images/profile-pic-learner.jpg";

                if (userData.role == "trainer") {
                    pfp = "images/profile-pic-trainer.jpg";
                    if (userData.verified) {
                        htmlContent += `
                        <p>You are verified!</p>
                        `
                    } else {
                        htmlContent += `
                        <p>You are not yet verified!</p>
                        `
                    }
                    if (!('trainerData' in userData)) {
                        htmlContent += `
                        <p>ALERT: You have not yet applied as a driving trainer!<br>
                        <a href="form.html">Apply now</a></p>
                        `
                    } else {
                        const trainerData = userData.trainerData
                        htmlContent += `
                        <p>Organization: ${trainerData.orgName}</p>
                        <p>Address: ${trainerData.address}</p>
                        <p>City: ${trainerData.city}</p>
                        <p>State: ${trainerData.state}</p>
                        <p>Website: <a href="${trainerData.website}" target="_blank">${trainerData.website}</a></p>
                        <p>Driving types: ${trainerData.drivingTypes}</p>
                        <div class="experience">
                            <h2>Experience</h2>
                            <p>${trainerData.experience} years</p>
                        </div>
                        <p>Fee Charged: ${trainerData.fee}</p>
                        `
                        pfp = trainerData.photo
                    }
                } else {
                    htmlContent += `
                    <p><a href="appointment.html">New appointment</a></p>
                    `
                }

                infoContainer.innerHTML = htmlContent;

                document.getElementById('profile-picture').src = pfp;
            } else {
                infoContainer.textContent = "No data available";
            }
        }).catch((error) => {
            console.error(error);
            const infoContainer = document.getElementById('info-container');
            infoContainer.textContent = "Error retrieving data";
        });
    });

    
});
