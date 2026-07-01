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

newOperation.addEventListener("click", async () => {

    document.getElementById("operationDate").value =
    new Date().toISOString().split("T")[0];

    await generateInvoiceNumber();

    modal.show();

});
// =====================================
// Default Date
// =====================================

document.getElementById("operationDate").value =
new Date().toISOString().split("T")[0];
// =====================================
// Generate Invoice Number
// =====================================

async function generateInvoiceNumber() {

    const type =
    document.getElementById("operationType").value;

    let ref;

    let prefix;

    if (type === "rebar") {

        ref = rebarRef;

        prefix = "RB";

    } else {

        ref = billetRef;

        prefix = "BL";

    }

    const snapshot = await getDocs(ref);

    const number = snapshot.size + 1;

    const year = new Date().getFullYear();

    document.getElementById("operationInvoice").value =

        `${prefix}-${year}-${String(number).padStart(5, "0")}`;

}
document.getElementById("operationType")
.addEventListener("change", generateInvoiceNumber);
