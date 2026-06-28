import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =========================
// Collections
// =========================

const invoicesRef = collection(db, "invoices");
const suppliersRef = collection(db, "suppliers");

// =========================
// Elements
// =========================

const invoiceNumber = document.getElementById("invoiceNumber");
const supplier = document.getElementById("supplier");
const invoiceDate = document.getElementById("invoiceDate");
const amount = document.getElementById("amount");
const currency = document.getElementById("currency");
const department = document.getElementById("department");
const dueDate = document.getElementById("dueDate");
const notes = document.getElementById("notes");

const saveInvoice = document.getElementById("saveInvoice");

const invoicesTable = document.getElementById("invoicesTable");

// =========================
// Start
// =========================

loadSuppliers();
loadInvoices();
generateInvoiceNumber();

invoiceDate.value = new Date().toISOString().split("T")[0];
// =========================
// Load Suppliers
// =========================

async function loadSuppliers() {

    supplier.innerHTML =
        '<option value="">اختر المورد</option>';

    try {

const q = query(suppliersRef, orderBy("company"));
        const snapshot = await getDocs(q);

        snapshot.forEach((docSnap) => {

            const data = docSnap.data();

            supplier.innerHTML += `

<option value="${docSnap.id}">

${data.name}

</option>

`;
        });

    }

    catch (error) {

        console.error(error);

    }

}
