async function loginUser() {

    alert("تم الضغط على زر تسجيل الدخول");

    errorMessage.style.display = "none";
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
