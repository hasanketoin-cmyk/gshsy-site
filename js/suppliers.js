import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =======================
// المراجع
// =======================

const suppliersRef = collection(db, "suppliers");

const supplierName = document.getElementById("supplierName");
const supplierPhone = document.getElementById("supplierPhone");
const supplierCurrency = document.getElementById("supplierCurrency");
const supplierStatus = document.getElementById("supplierStatus");
const supplierNotes = document.getElementById("supplierNotes");

const suppliersTable = document.getElementById("suppliersTable");
const saveSupplier = document.getElementById("saveSupplier");

// =======================
// بداية الصفحة
// =======================

loadSuppliers();

saveSupplier.addEventListener("click", addSupplier);

// =======================
// إضافة مورد
// =======================

async function addSupplier() {

    if (supplierName.value.trim() === "") {

        alert("يرجى إدخال اسم المورد");

        return;
    }

    try {

        await addDoc(suppliersRef, {

            name: supplierName.value,

            phone: supplierPhone.value,

            currency: supplierCurrency.value,

            status: supplierStatus.value,

            notes: supplierNotes.value,

            createdAt: new Date()

        });

        alert("تمت إضافة المورد");

        clearForm();

        loadSuppliers();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =======================
// تحميل الموردين
// =======================

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

                <button
                    class="btn btn-danger btn-sm deleteBtn"
                    data-id="${docSnap.id}">

                    حذف

                </button>

            </td>

        </tr>

        `;

    });

    document.querySelectorAll(".deleteBtn").forEach(btn => {

        btn.addEventListener("click", function () {

            deleteSupplier(this.dataset.id);

        });

    });

}

// =======================
// حذف مورد
// =======================

async function deleteSupplier(id) {

    console.log("Delete ID:", id);

    if (!confirm("هل تريد حذف المورد؟")) return;

    try {

        await deleteDoc(doc(db, "suppliers", id));

        alert("تم حذف المورد");

        loadSuppliers();

    } catch (error) {

        console.error("Delete Error:", error);

        alert(error.message);

    }

}

// =======================
// تنظيف النموذج
// =======================

function clearForm() {

    supplierName.value = "";

    supplierPhone.value = "";

    supplierCurrency.value = "SYP";

    supplierStatus.value = "نشط";

    supplierNotes.value = "";

}
