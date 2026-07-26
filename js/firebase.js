// ======================================================
// ATTENDANCE CHECKER
// FIREBASE CONNECTION
// VERSION 1.2 STABLE
// ======================================================


// ================================
// FIREBASE IMPORTS
// ================================

import { initializeApp }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";


import { getFirestore }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";


import { getStorage }

from "https://www.gstatic.com/firebasejs/10.12.2/firebase-storage.js";





// ================================
// FIREBASE CONFIG
// ================================

const firebaseConfig = {


    apiKey:
    "AIzaSyA6gyqdZI5HRRLC4bL56rpWZAUn1O1pK2Q",


    authDomain:
    "attendance-checker-3f355.firebaseapp.com",


    projectId:
    "attendance-checker-3f355",


    storageBucket:
    "attendance-checker-3f355.appspot.com",


    messagingSenderId:
    "962480612505",


    appId:
    "1:962480612505:web:62a616104a57e1f9808408"


};







// ================================
// INITIALIZE FIREBASE
// ================================

const app = initializeApp(firebaseConfig);







// ================================
// FIRESTORE
// ================================

const db = getFirestore(app);







// ================================
// STORAGE
// ================================

const storage = getStorage(app);







// ================================
// CONNECTION TEST
// ================================

console.log(
    "🔥 Firebase initialized successfully"
);







// ================================
// EXPORT
// ================================

export {

    app,

    db,

    storage

};
