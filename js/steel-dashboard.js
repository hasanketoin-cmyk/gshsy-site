import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ===============================
// Collections
// ===============================

const rebarRef = collection(db, "steel_rebar");
const billetRef = collection(db, "steel_billet");

// ===============================
// Elements
// ===============================

const newOperation =
document.getElementById("newOperation");

const operationModal =
document.getElementById("operationModal");

// ===============================
// Bootstrap Modal
// ===============================

const modal =
new bootstrap.Modal(operationModal);

// ===============================
// Open Modal
// ===============================

newOperation.addEventListener("click", () => {

    modal.show();

});
