import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyDA41cI55P-JXR6QRm5xbcBLmj6542Ls08",
    authDomain: "drivelink-30e19.firebaseapp.com",
    projectId: "drivelink-30e19",
    storageBucket: "drivelink-30e19.appspot.com",
    messagingSenderId: "472849376201",
    appId: "1:472849376201:web:b8bd3bf2665cd90dfb7e18",
    measurementId: "G-3JGKXJPT6D",
    databaseURL: "https://drivelink-30e19-default-rtdb.asia-southeast1.firebasedatabase.app"
};  

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log('Firebase app initialized:', app);

export { app };
