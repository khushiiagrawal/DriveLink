import { app } from "./app.js";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";
import { getDatabase, ref, update } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js";

function checkFileSize(file, maxSize) {
    if (file.size > maxSize) {
        alert(`File ${file.name} size exceeds the ${maxSize / (1024 * 1024)}MB limit.`);
        return false;
    }

    return true;
}

// Function to upload a file and get its download URL
async function uploadFile(file, path) {
    const storage = getStorage(app);
    const fileRef = storageRef(storage, path);
    try {
        await uploadBytes(fileRef, file);
        return await getDownloadURL(fileRef);
    } catch (error) {
        console.error('Upload failed:', error);
        throw error;
    }
}

// Function to handle the form submission
async function handleFormSubmission(user, orgName, address, city, state, website, drivingTypes, drivingLicense, aadhaar, photo, experience, fee) {
    try {
        // Prepare file upload promises
        const drivingLicenseUrl = drivingLicense ? await uploadFile(drivingLicense, 'uploads/' + user.uid + '/drivingLicense') : null;
        const aadhaarUrl = aadhaar ? await uploadFile(aadhaar, 'uploads/' + user.uid + '/aadhaar') : null;
        const photoUrl = photo ? await uploadFile(photo, 'uploads/' + user.uid + '/photo') : null;

        // Prepare trainerData to be updated
        const trainerData = {
            orgName: orgName,
            address: address,
            city: city,
            state: state,
            website: website,
            drivingTypes: drivingTypes,
            drivingLicense: drivingLicenseUrl,
            aadhaar: aadhaarUrl,
            photo: photoUrl,
            experience: experience,
            fee: fee
        };

        // Get the db
        const db = getDatabase(app);

        // Update existing user data with new trainerData field
        await update(ref(db, 'Users/' + user.uid), { trainerData });
        alert("Applied successfully!!");
    } catch (error) {
        alert("Unsuccessful");
        console.error(error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById('submit').addEventListener('click', function (e) {
        e.preventDefault(); // Prevent the default form submission
        console.log("submit pressed")

        // Check if the user is logged in
        const auth = getAuth(app);
        onAuthStateChanged(auth, (user) => {
            if (!user) {
                alert("Error: Not logged in!")
                window.history.back();
            }
            // TODO also check if role is correct

            // Get input values
            let orgName = document.getElementById('orgname').value;
            let address = document.getElementById('address').value;
            let city = document.getElementById('city').value;
            let state = document.getElementById('state').value;
            let website = document.getElementById('website').value;
            let drivingTypes = document.getElementById('drivingTypes').value;
            let drivingLicense = document.getElementById('drivingLicense').files[0];
            let aadhaar = document.getElementById('aadhaar').files[0];
            let photo = document.getElementById('photo').files[0];
            let experience = document.getElementById('experience').value;
            let fee = document.getElementById('fee').value;

            // TODO FILE SIZE CHECK

            // Add data to Firebase
            handleFormSubmission(user, orgName, address, city, state, website, drivingTypes, drivingLicense, aadhaar, photo, experience, fee);
            // set(ref(db, 'Users/' + user.uid), {
            //     trainerData: {
            //         orgName: orgName,
            //         address: address,
            //         city: city,
            //         state: state,
            //         website: website,
            //         drivingTypes: drivingTypes,
            //         drivingLicense: drivingLicense,
            //         aadhaar: aadhaar,
            //         photo: photo,
            //         experience: experience,
            //         fee: fee
            //     }
            // }).then(() => {
            //     alert("Applied successfully!!");
            // }).catch((error) => {
            //     alert("Unsuccessful");
            //     console.error(error);
            // });
        });
    });
});
