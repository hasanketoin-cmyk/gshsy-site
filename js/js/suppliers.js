import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    orderBy,
    query
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const suppliersRef = collection(db, "suppliers");

const supplierName = document.getElementById("supplierName");
const supplierPhone = document.getElementById("supplierPhone");
const supplierEmail = document.getElementById("supplierEmail");
const supplierAddress = document.getElementById("supplierAddress");
const supplierTax = document.getElementById("supplierTax");
const supplierCurrency = document.getElementById("supplierCurrency");
const supplierStatus = document.getElementById("supplierStatus");
const supplierNotes = document.getElementById("supplierNotes");

const suppliersTable = document.getElementById("suppliersTable");

const saveSupplier = document.getElementById("saveSupplier");

saveSupplier.addEventListener("click", addSupplier);

loadSuppliers();

async function addSupplier() {

    if (supplierName.value.trim() === "") {
        alert("يرجى إدخال اسم المورد");
        return;
    }

    await addDoc(suppliersRef, {

        name: supplierName.value,

        phone: supplierPhone.value,

        email: supplierEmail.value,

        address: supplierAddress.value,

        taxNumber: supplierTax.value,

        currency: supplierCurrency.value,

        status: supplierStatus.value,

        notes: supplierNotes.value,

        createdAt: new Date()

    });

    alert("تمت إضافة المورد");

    clearForm();

    loadSuppliers();

}

async function loadSuppliers() {

    suppliersTable.innerHTML = "";

    const q = query(suppliersRef, orderBy("name"));

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        suppliersTable.innerHTML += `

        <tr>

            <td>${data.name}</td>

            <td>${data.phone}</td>

            <td>${data.currency}</td>

            <td>${data.status}</td>

            <td>

                <button class="btn btn-sm btn-danger deleteBtn" data-id="${docSnap.id}">

                    <i class="fa-solid fa-trash"></i>

                </button>

            </td>

        </tr>

        `;

    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {

        btn.onclick = () => deleteSupplier(btn.dataset.id);

    });

}

async function deleteSupplier(id) {

    if (!confirm("حذف المورد؟")) return;

    await deleteDoc(doc(db, "suppliers", id));

    loadSuppliers();

}

function clearForm() {

    supplierName.value = "";
    supplierPhone.value = "";
    supplierEmail.value = "";
    supplierAddress.value = "";
    supplierTax.value = "";
    supplierCurrency.value = "SYP";
    supplierStatus.value = "نشط";
    supplierNotes.value = "";

}
