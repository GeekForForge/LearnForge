// src/firebase.jsx

import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // ✅ Import Firestore



const firebaseConfig = {
    apiKey: "AIzaSyAp0TVL1_IMzF_ywAU7VWkUajw-RYhS7E4",
    authDomain: "learnforge-174ef.firebaseapp.com",
    projectId: "learnforge-174ef",
    storageBucket: "learnforge-174ef.firebasestorage.app",
    messagingSenderId: "220012925043",
    appId: "1:220012925043:web:372696a7c56d71bed65a06",
    measurementId: "G-89Q9G21FNC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// ✅ Initialize and export Firestore
const db = getFirestore(app);

export { app, db, analytics }; // ✅ Export db