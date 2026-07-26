// ======================================================
// ATTENDANCE CHECKER
// FIREBASE CONNECTION
// VERSION 1.0
// ======================================================


// Firebase imports

import { initializeApp } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { getFirestore } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import { getStorage } 
from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";



// Firebase Configuration

const firebaseConfig = {

    apiKey: "AIzaSyA6gyqdZI5HRRLC4bL56rpWZAUn1O1pK2Q",

    authDomain: "attendance-checker-3f355.firebaseapp.com",

    projectId: "attendance-checker-3f355",

    storageBucket: "attendance-checker-3f355.firebasestorage.app",

    messagingSenderId: "962480612505",

    appId: "1:962480612505:web:62a616104a57e1f9808408"

};




// Initialize Firebase

const app = initializeApp(firebaseConfig);



// Database

const db = getFirestore(app);



// Storage for student photos

const storage = getStorage(app);



// Export

export {

    app,

    db,

    storage

};
