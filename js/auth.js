import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

import {
    getAuth,
    signInWithEmailAndPassword,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

// =======================
// Firebase Config
// =======================

const firebaseConfig = {

    apiKey: "YOUR_API_KEY",

    authDomain: "YOUR_PROJECT.firebaseapp.com",

    projectId: "YOUR_PROJECT_ID",

    storageBucket: "YOUR_PROJECT.appspot.com",

    messagingSenderId: "YOUR_SENDER_ID",

    appId: "YOUR_APP_ID"

};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

// =======================
// Elements
// =======================

const loginBtn = document.getElementById("loginBtn");

const email = document.getElementById("email");

const password = document.getElementById("password");

const errorMessage = document.getElementById("errorMessage");

const loading = document.getElementById("loading");

// =======================
// Login
// =======================

if (loginBtn) {

    loginBtn.addEventListener("click", loginUser);

}
import { auth } from "./firebase.js";

import {
    signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

const loginBtn = document.getElementById("loginBtn");
const email = document.getElementById("email");
const password = document.getElementById("password");
const errorMessage = document.getElementById("errorMessage");
const loading = document.getElementById("loading");

if (loginBtn) {

    loginBtn.addEventListener("click", loginUser);

}

async function loginUser() {

    errorMessage.style.display = "none";

    loading.style.display = "block";

    try {

        await signInWithEmailAndPassword(

            auth,

            email.value,

            password.value

        );

        window.location.href = "dashboard.html";

    }

    catch (error) {

        loading.style.display = "none";

        errorMessage.style.display = "block";

        console.error(error);

    }

}
