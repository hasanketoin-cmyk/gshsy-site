import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const invoicesRef = collection(db, "invoices");

const invoiceSelect = document.getElementById("invoiceSelect");

loadInvoices();

async function loadInvoices() {

    invoiceSelect.innerHTML =
        '<option value="">اختر الفاتورة</option>';

    const q = query(invoicesRef, orderBy("number"));

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        invoiceSelect.innerHTML += `

        <option value="${docSnap.id}">

            ${data.number} | ${data.supplier}

        </option>

        `;

    });

}
