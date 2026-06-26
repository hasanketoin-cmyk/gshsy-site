import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    updateDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

console.log("app.js loaded");

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
console.log("invoiceNumber =", invoiceNumber);
console.log("supplier =", supplier);
console.log("section =", section);
console.log("currency =", currency);
console.log("amount =", amount);
console.log("dueDate =", dueDate);
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
// =========================
// حفظ فاتورة جديدة
// =========================

saveBtn.addEventListener("click", saveInvoice);

async function saveInvoice() {

    if (invoiceNumber.value.trim() === "") {
        alert("يرجى إدخال رقم الفاتورة");
        return;
    }

    try {
console.log("supplier:", supplier);
console.log("section:", section);
console.log("currency:", currency);
console.log("amount:", amount);
console.log("dueDate:", dueDate);
console.log("notes:", notes);
        
        await addDoc(invoicesRef, {

            number: invoiceNumber.value,

            date: invoiceDate.value,

            supplier: supplier.value,

            section: section.value,

            currency: currency.value,

            amount: Number(amount.value),

            dueDate: dueDate.value,

            notes: notes.value,

            createdAt: new Date()

        });

        alert("تم حفظ الفاتورة بنجاح");

        clearForm();

        loadInvoices();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء الحفظ");

    }

}

// =========================
// تنظيف النموذج
// =========================

function clearForm(){

    invoiceNumber.value = "";
    invoiceDate.value = "";
    supplier.selectedIndex = 0;
    section.selectedIndex = 0;
    currency.selectedIndex = 0;
    amount.value = "";
    dueDate.value = "";
    notes.value = "";

}
