import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    query,
    orderBy,
    doc,
    updateDoc,
    deleteDoc,
    Timestamp

} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ===========================
// Collections
// ===========================

const invoicesRef = collection(db, "invoices");
const paymentsRef = collection(db, "payments");

// ===========================
// Elements
// ===========================

const invoiceSelect = document.getElementById("invoiceSelect");

const paymentSupplier = document.getElementById("paymentSupplier");
const invoiceAmount = document.getElementById("invoiceAmount");
const paidAmount = document.getElementById("paidAmount");
const remainingAmount = document.getElementById("remainingAmount");

const paymentAmount = document.getElementById("paymentAmount");
const paymentMethod = document.getElementById("paymentMethod");
const paymentDate = document.getElementById("paymentDate");
const paymentNotes = document.getElementById("paymentNotes");

const savePayment = document.getElementById("savePayment");

const paymentsTable = document.getElementById("paymentsTable");

// ===========================
// Start
// ===========================

loadInvoices();
loadPayments();

paymentDate.value = new Date().toISOString().split("T")[0];

invoiceSelect.addEventListener("change", loadInvoiceData);

savePayment.addEventListener("click", savePaymentData);

// ===========================
// Load invoices
// ===========================

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

// ===========================
// Invoice details
// ===========================

async function loadInvoiceData() {

    if (invoiceSelect.value === "") return;

    const invoiceRef = doc(db, "invoices", invoiceSelect.value);

    const invoiceSnap = await getDoc(invoiceRef);

    const data = invoiceSnap.data();

    paymentSupplier.value = data.supplier;

    invoiceAmount.value = data.amount;

    paidAmount.value = data.paid || 0;

    remainingAmount.value =
        data.remaining ?? data.amount;

}
// ===========================
// Save Payment
// ===========================

async function savePaymentData() {

    if (invoiceSelect.value === "") {

        alert("اختر الفاتورة");

        return;

    }

    if (paymentAmount.value === "") {

        alert("أدخل مبلغ الدفعة");

        return;

    }

    try {

        const invoiceRef = doc(db, "invoices", invoiceSelect.value);

        const invoiceSnap = await getDoc(invoiceRef);

        const invoice = invoiceSnap.data();

        const oldPaid = Number(invoice.paid || 0);

        const totalAmount = Number(invoice.amount);

        const newPayment = Number(paymentAmount.value);

        const newPaid = oldPaid + newPayment;

        const remaining = totalAmount - newPaid;

        let status = "غير مدفوعة";

        if (remaining <= 0) {

            status = "مدفوعة";

        }

        else if (newPaid > 0) {

            status = "مدفوعة جزئياً";

        }

        await addDoc(paymentsRef, {

            invoiceId: invoiceSelect.value,

            invoiceNumber: invoice.number,

            supplier: invoice.supplier,

            paymentAmount: newPayment,

            invoiceAmount: totalAmount,

            paymentMethod: paymentMethod.value,

            paymentDate: paymentDate.value,

            notes: paymentNotes.value,

            createdAt: Timestamp.now()

        });

        await updateDoc(invoiceRef, {

            paid: newPaid,

            remaining: remaining,

            status: status

        });

        alert("تم حفظ الدفعة");

        clearPaymentForm();

        loadPayments();

        loadInvoiceData();

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ===========================
// Load Payments
// ===========================

async function loadPayments() {

    paymentsTable.innerHTML = "";

    const q = query(paymentsRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        paymentsTable.innerHTML += `

        <tr>

            <td>${data.invoiceNumber}</td>

            <td>${data.supplier}</td>

            <td>${data.paymentAmount}</td>

            <td>${data.invoiceAmount}</td>

            <td>${data.paymentDate}</td>

            <td>تم الدفع</td>

           <td>

<button
class="btn btn-danger btn-sm"
onclick="deletePayment('${docSnap.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

        </tr>

        `;

    });

}

// ===========================
// Clear Form
// ===========================

function clearPaymentForm() {

    invoiceSelect.value = "";

    paymentSupplier.value = "";

    invoiceAmount.value = "";

    paidAmount.value = "";

    remainingAmount.value = "";

    paymentAmount.value = "";

    paymentMethod.value = "نقداً";

    paymentNotes.value = "";

}
// ===========================
// Delete Payment
// ===========================

window.deletePayment = async function(id){

    if(!confirm("هل تريد حذف هذه الدفعة؟")) return;

    try{

        const paymentRef = doc(db,"payments",id);

        const paymentSnap = await getDoc(paymentRef);

        if(!paymentSnap.exists()) return;

        const payment = paymentSnap.data();
        if (!payment.invoiceId) {

    await deleteDoc(paymentRef);

    alert("تم حذف الدفعة");

    loadPayments();

    return;

}

        const invoiceRef = doc(db,"invoices",payment.invoiceId);

        const invoiceSnap = await getDoc(invoiceRef);

        if(invoiceSnap.exists()){

            const invoice = invoiceSnap.data();

            const newPaid =
                Number(invoice.paid||0)
                -
                Number(payment.paymentAmount||0);

            const remaining =
                Number(invoice.amount||0)
                -
                newPaid;

            let status="غير مدفوعة";

            if(newPaid<=0){

                status="غير مدفوعة";

            }
            else if(remaining<=0){

                status="مدفوعة";

            }
            else{

                status="مدفوعة جزئياً";

            }

            await updateDoc(invoiceRef,{

                paid:newPaid,

                remaining:remaining,

                status:status

            });

        }

        await deleteDoc(paymentRef);

        alert("تم حذف الدفعة");

        loadPayments();

        loadInvoiceData();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
