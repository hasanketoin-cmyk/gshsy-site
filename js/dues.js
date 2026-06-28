import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ===========================
// Collections
// ===========================

const invoicesRef = collection(db, "invoices");

// ===========================
// Elements
// ===========================

const duesTable = document.getElementById("duesTable");

const totalRemaining = document.getElementById("totalRemaining");
const totalInvoices = document.getElementById("totalInvoices");
const lateInvoices = document.getElementById("lateInvoices");
const weekInvoices = document.getElementById("weekInvoices");

// ===========================
// Start
// ===========================

loadDues();

// ===========================
// Load Dues
// ===========================

async function loadDues() {

    duesTable.innerHTML = "";

    let remainingTotal = 0;
    let invoiceCount = 0;
    let lateCount = 0;
    let weekCount = 0;

    const today = new Date();

    const q = query(invoicesRef, orderBy("dueDate"));

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        const total = Number(data.amount || 0);
        const paid = Number(data.paid || 0);
        const remaining = Number(data.remaining ?? total);

        if (remaining <= 0) return;

        invoiceCount++;

        remainingTotal += remaining;

        let status = "مستحقة";

        if (data.dueDate) {

            const due = new Date(data.dueDate);

            const diff =
                Math.ceil((due - today) / (1000 * 60 * 60 * 24));

            if (diff < 0) {

                status = "متأخرة";

                lateCount++;

            }
            else if (diff <= 7) {

                weekCount++;

            }

        }

        duesTable.innerHTML += `

        <tr>

            <td>${data.number}</td>

            <td>${data.supplier}</td>

            <td>${total.toLocaleString()}</td>

            <td>${paid.toLocaleString()}</td>

            <td>${remaining.toLocaleString()}</td>

            <td>${data.dueDate || "-"}</td>

            <td>

                <span class="badge ${status === "متأخرة" ? "bg-danger" : "bg-warning"}">

                    ${status}

                </span>

            </td>

            <td>

                <a href="payments.html" class="btn btn-success btn-sm">

                    دفع

                </a>

            </td>

        </tr>

        `;

    });

    totalRemaining.innerHTML = remainingTotal.toLocaleString();

    totalInvoices.innerHTML = invoiceCount;

    lateInvoices.innerHTML = lateCount;

    weekInvoices.innerHTML = weekCount;

}
