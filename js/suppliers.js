import { db } from "./firebase.js";

import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const suppliersRef = collection(db, "suppliers");

const supplierName = document.getElementById("supplierName");
const supplierPhone = document.getElementById("supplierPhone");
const supplierCurrency = document.getElementById("supplierCurrency");
const supplierStatus = document.getElementById("supplierStatus");
const supplierNotes = document.getElementById("supplierNotes");

const suppliersTable = document.getElementById("suppliersTable");
const saveSupplier = document.getElementById("saveSupplier");

saveSupplier.addEventListener("click", addSupplier);

loadSuppliers();

async function addSupplier() {
  if (supplierName.value.trim() === "") {
    alert("يرجى إدخال اسم الشركة");
    return;
  }

  await addDoc(suppliersRef, {
    name: supplierName.value,
    phone: supplierPhone.value,
    currency: supplierCurrency.value,
    status: supplierStatus.value,
    notes: supplierNotes.value,
    createdAt: new Date()
  });

  alert("تمت إضافة المورد");

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
          <button class="btn btn-danger btn-sm">حذف</button>
        </td>
      </tr>
    `;
  });
}
