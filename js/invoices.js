import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    serverTimestamp,
    doc,
    updateDoc,
    deleteDoc
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =====================================
// Collections
// =====================================

const invoicesRef = collection(db, "invoices");
const suppliersRef = collection(db, "suppliers");

// =====================================
// Elements
// =====================================

const invoiceNumber = document.getElementById("invoiceNumber");
const invoiceDate = document.getElementById("invoiceDate");
const supplier = document.getElementById("supplier");
const section = document.getElementById("section");
const currency = document.getElementById("currency");
const amount = document.getElementById("amount");
const dueDate = document.getElementById("dueDate");
const notes = document.getElementById("notes");

const saveInvoice = document.getElementById("saveInvoice");
const newInvoice = document.getElementById("newInvoice");
const editInvoice = document.getElementById("editInvoice");
const deleteInvoice = document.getElementById("deleteInvoice");

const invoiceTable = document.getElementById("invoiceTable");
const searchInvoice = document.getElementById("searchInvoice");

// =====================================
// Variables
// =====================================

let selectedInvoiceId = null;

// =====================================
// Start
// =====================================

window.addEventListener("DOMContentLoaded", () => {

    invoiceDate.value = new Date().toISOString().split("T")[0];

    loadSuppliers();

    loadInvoices();

    generateInvoiceNumber();

});

saveInvoice.addEventListener("click", saveInvoiceData);

newInvoice.addEventListener("click", clearForm);

// =====================================
// Generate Invoice Number
// =====================================

async function generateInvoiceNumber(){

    const snapshot = await getDocs(invoicesRef);

    let number = snapshot.size + 1;

    invoiceNumber.value =
        "INV-" + number.toString().padStart(5,"0");

}

// =====================================
// Load Suppliers
// =====================================

async function loadSuppliers(){

    console.log("loadSuppliers started");

    supplier.innerHTML =
    `<option value="">اختر المورد</option>`;

    const q =
    query(suppliersRef,orderBy("name"));

    const snapshot =
    await getDocs(q);

    snapshot.forEach((docSnap)=>{

        const data=docSnap.data();

        supplier.innerHTML += `

        <option value="${data.name}">

            ${data.name}

        </option>

        `;

    });

}
// =====================================
// Save Invoice
// =====================================

async function saveInvoiceData() {

    if (supplier.value === "") {

        alert("اختر المورد");

        return;

    }

    if (amount.value === "") {

        alert("أدخل مبلغ الفاتورة");

        return;

    }

    try {

        await addDoc(invoicesRef, {

            number: invoiceNumber.value,

            date: invoiceDate.value,

            supplier: supplier.value,

            section: section.value,

            currency: currency.value,

            amount: Number(amount.value),

            paid: 0,

            remaining: Number(amount.value),

            dueDate: dueDate.value,

            notes: notes.value,

            status: "غير مدفوعة",

            createdAt: serverTimestamp()

        });

        alert("تم حفظ الفاتورة بنجاح");

        clearForm();

        generateInvoiceNumber();

        loadInvoices();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// =====================================
// Clear Form
// =====================================

function clearForm(){

    selectedInvoiceId = null;

    supplier.value = "";

    section.selectedIndex = 0;

    currency.value = "USD";

    amount.value = "";

    dueDate.value = "";

    notes.value = "";

    invoiceDate.value =
    new Date().toISOString().split("T")[0];

}

// =====================================
// Load Invoices
// =====================================

async function loadInvoices() {

    invoiceTable.innerHTML = "";

    const q = query(invoicesRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);
console.log("Suppliers count:", snapshot.size);
    if (snapshot.empty) {

        invoiceTable.innerHTML = `

        <tr>

            <td colspan="8" class="text-center text-muted">

                لا توجد فواتير

            </td>

        </tr>

        `;

        return;

    }

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        invoiceTable.innerHTML += `

        <tr>

            <td>${data.number}</td>

            <td>${data.date}</td>

            <td>${data.supplier}</td>

            <td>${data.section}</td>

            <td>${data.currency}</td>

            <td>${Number(data.amount).toLocaleString()}</td>

            <td>${data.dueDate || "-"}</td>

            <td>

                <button
                    class="btn btn-warning btn-sm editBtn"
                    data-id="${docSnap.id}">

                    <i class="fa-solid fa-pen"></i>

                </button>

                <button
                    class="btn btn-danger btn-sm deleteBtn"
                    data-id="${docSnap.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    document.querySelectorAll(".editBtn").forEach(btn => {

        btn.addEventListener("click", () => {

            editInvoiceData(btn.dataset.id);

        });

    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {

        btn.addEventListener("click", () => {

            deleteInvoiceData(btn.dataset.id);

        });

    });

}
// =====================================
// Edit Invoice
// =====================================

async function editInvoiceData(id){

    selectedInvoiceId = id;

    const invoiceRef = doc(db,"invoices",id);

    const invoiceSnap = await getDoc(invoiceRef);

    if(!invoiceSnap.exists()) return;

    const data = invoiceSnap.data();

    invoiceNumber.value = data.number;
    invoiceDate.value = data.date;
    supplier.value = data.supplier;
    section.value = data.section;
    currency.value = data.currency;
    amount.value = data.amount;
    dueDate.value = data.dueDate;
    notes.value = data.notes;

}
// =====================================
// Update Invoice
// =====================================

editInvoice.addEventListener("click",updateInvoice);

async function updateInvoice(){

    if(selectedInvoiceId==null){

        alert("اختر فاتورة أولاً");

        return;

    }

    try{

        await updateDoc(doc(db,"invoices",selectedInvoiceId),{

            number:invoiceNumber.value,

            date:invoiceDate.value,

            supplier:supplier.value,

            section:section.value,

            currency:currency.value,

            amount:Number(amount.value),

            remaining:Number(amount.value),

            dueDate:dueDate.value,

            notes:notes.value

        });

        alert("تم تعديل الفاتورة");

        clearForm();

        loadInvoices();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// =====================================
// Delete Invoice
// =====================================

deleteInvoice.addEventListener("click",()=>{

    if(selectedInvoiceId==null){

        alert("اختر فاتورة أولاً");

        return;

    }

    deleteInvoiceData(selectedInvoiceId);

});

async function deleteInvoiceData(id){

    if(!confirm("هل تريد حذف الفاتورة؟")) return;

    try{

        await deleteDoc(doc(db,"invoices",id));

        alert("تم حذف الفاتورة");

        clearForm();

        loadInvoices();

        generateInvoiceNumber();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// =====================================
// Search Invoices
// =====================================

searchInvoice.addEventListener("keyup", function () {

    const value = this.value.toLowerCase();

    const rows = invoiceTable.querySelectorAll("tr");

    rows.forEach(row => {

        row.style.display =
            row.innerText.toLowerCase().includes(value)
            ? ""
            : "none";

    });

});

// =====================================
// New Invoice
// =====================================

newInvoice.addEventListener("click", () => {

    clearForm();

    generateInvoiceNumber();

});

// =====================================
// Reload After Save
// =====================================

async function refreshInvoices(){

    await loadInvoices();

    await generateInvoiceNumber();

}

// =====================================
// End
// =====================================
