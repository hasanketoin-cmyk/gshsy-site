import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =========================
// Collections
// =========================

const invoicesRef = collection(db, "invoices");

// =========================
// عناصر الصفحة
// =========================

const invoiceNumber = document.getElementById("invoiceNumber");
const invoiceDate = document.getElementById("invoiceDate");
const supplier = document.getElementById("supplier");
const section = document.getElementById("section");
const currency = document.getElementById("currency");
const amount = document.getElementById("amount");
const dueDate = document.getElementById("dueDate");
const notes = document.getElementById("notes");

const saveBtn = document.getElementById("saveInvoice");

const table = document.getElementById("invoiceTable");

// =========================
// تحميل الفواتير
// =========================

async function loadInvoices(){

    table.innerHTML = "";

    const snapshot = await getDocs(invoicesRef);

    if(snapshot.empty){

        table.innerHTML = `

        <tr>

        <td colspan="8" class="text-center">

        لا توجد فواتير

        </td>

        </tr>

        `;

        return;

    }

    snapshot.forEach((docItem)=>{

        const inv = docItem.data();

        table.innerHTML += `

        <tr>

            <td>${inv.number}</td>

            <td>${inv.date}</td>

            <td>${inv.supplier}</td>

            <td>${inv.section}</td>

            <td>${inv.currency}</td>

            <td>${inv.amount}</td>

            <td>${inv.dueDate}</td>

            <td>

                <button
                class="btn btn-sm btn-danger"
                onclick="deleteInvoice('${docItem.id}')">

                حذف

                </button>

            </td>

        </tr>

        `;

    });

}

loadInvoices();
