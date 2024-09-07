import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";
import { app } from "./app.js"

const db = getDatabase(app);

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('appointmentForm').addEventListener('submit', function (e) {
        e.preventDefault(); // Prevent the default form submission

        // Get input values
        let name = document.getElementById('name').value;
        let email = document.getElementById('email').value;
        let trainer = document.getElementById('trainer').value;
        let type = document.getElementById('type').value;
        let message = document.getElementById('message').value;

        // Add data to Firebase
        set(ref(db, 'Appointments/' + name), {
            nameofuser: name,
            mailofuser: email,
            nameoftrainer: trainer,
            vehicletype: type,
            message: message
        }).then(() => {
            alert("Data added successfully!!");
            // Optionally, clear the form after successful submission
            document.getElementById('appointmentForm').reset();
        }).catch((error) => {
            alert("Unsuccessful");
            console.error(error);
        });
    });
});
