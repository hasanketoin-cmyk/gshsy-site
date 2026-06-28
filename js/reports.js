import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =========================
// Collections
// =========================

const invoicesRef = collection(db, "invoices");
const suppliersRef = collection(db, "suppliers");

// =========================
// Elements
// =========================

const reportsTable = document.getElementById("reportsTable");

const supplierFilter = document.getElementById("supplierFilter");
const statusFilter = document.getElementById("statusFilter");
const fromDate = document.getElementById("fromDate");
const toDate = document.getElementById("toDate");

const reportInvoices = document.getElementById("reportInvoices");
const reportPaid = document.getElementById("reportPaid");
const reportRemaining = document.getElementById("reportRemaining");
const reportSuppliers = document.getElementById("reportSuppliers");

const summaryInvoices = document.getElementById("summaryInvoices");
const summaryPaid = document.getElementById("summaryPaid");
const summaryRemaining = document.getElementById("summaryRemaining");
const summarySuppliers = document.getElementById("summarySuppliers");

const searchReport = document.getElementById("searchReport");
const resetReport = document.getElementById("resetReport");
const excelReport = document.getElementById("excelReport");

const pdfReport = document.getElementById("pdfReport");

const printReport = document.getElementById("printReport");
// =========================
// Start
// =========================

loadSuppliers();

loadReports();

searchReport.addEventListener("click", loadReports);

excelReport.addEventListener("click", exportExcel);

pdfReport.addEventListener("click", exportPDF);

printReport.addEventListener("click", printTable);

resetReport.addEventListener("click", () => {
    supplierFilter.value = "";
    statusFilter.value = "";
    fromDate.value = "";
    toDate.value = "";

    loadReports();

});

// =========================
// Suppliers
// =========================

async function loadSuppliers() {

    supplierFilter.innerHTML =
        '<option value="">جميع الموردين</option>';

    const q = query(suppliersRef, orderBy("name"));

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        supplierFilter.innerHTML += `

        <option value="${data.name}">

            ${data.name}

        </option>

        `;

    });

}
// =========================
// Reports
// =========================

async function loadReports() {

    reportsTable.innerHTML = "";

    let invoicesCount = 0;

    let paidTotal = 0;

    let remainingTotal = 0;

    const supplierSet = new Set();

    const q = query(invoicesRef, orderBy("date", "desc"));

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        // =====================
        // الفلاتر
        // =====================

        if (
            supplierFilter.value &&
            data.supplier !== supplierFilter.value
        ) return;

        if (
            statusFilter.value &&
            data.status !== statusFilter.value
        ) return;

        if (
            fromDate.value &&
            data.date < fromDate.value
        ) return;

        if (
            toDate.value &&
            data.date > toDate.value
        ) return;

        invoicesCount++;

        const total = Number(data.amount || 0);

        const paid = Number(data.paid || 0);

        const remaining =
            Number(data.remaining ?? total);

        paidTotal += paid;

        remainingTotal += remaining;

        supplierSet.add(data.supplier);

        reportsTable.innerHTML += `

        <tr>

            <td>${data.number}</td>

            <td>${data.supplier}</td>

            <td>${data.section || "-"}</td>

            <td>${data.date}</td>

            <td>${total.toLocaleString()}</td>

            <td>${paid.toLocaleString()}</td>

            <td>${remaining.toLocaleString()}</td>

            <td>

                <span class="badge ${
                    data.status === "مدفوعة"
                    ? "bg-success"
                    : data.status === "مدفوعة جزئياً"
                    ? "bg-warning text-dark"
                    : "bg-danger"
                }">

                    ${data.status || "غير مدفوعة"}

                </span>

            </td>

        </tr>

        `;

    });

    reportInvoices.innerHTML =
        invoicesCount.toLocaleString();

    reportPaid.innerHTML =
        paidTotal.toLocaleString();

    reportRemaining.innerHTML =
        remainingTotal.toLocaleString();

    reportSuppliers.innerHTML =
        supplierSet.size;

    summaryInvoices.innerHTML =
        invoicesCount.toLocaleString();

    summaryPaid.innerHTML =
        paidTotal.toLocaleString();

    summaryRemaining.innerHTML =
        remainingTotal.toLocaleString();

    summarySuppliers.innerHTML =
        supplierSet.size;
drawChart();
}
// =========================
// Chart
// =========================

let reportChart = null;

async function drawChart() {

    const months = [
        "01","02","03","04","05","06",
        "07","08","09","10","11","12"
    ];

    const values = Array(12).fill(0);

    const snapshot = await getDocs(invoicesRef);

    snapshot.forEach((docSnap)=>{

        const data = docSnap.data();

        if(!data.date) return;

        const month = data.date.substring(5,7);

        const index = months.indexOf(month);

        if(index >= 0){

            values[index] += Number(data.amount || 0);

        }

    });

    const ctx =
        document.getElementById("reportsChart");

    if(reportChart){

        reportChart.destroy();

    }

    reportChart = new Chart(ctx,{

        type:"bar",

        data:{

            labels:[
                "يناير",
                "فبراير",
                "مارس",
                "أبريل",
                "مايو",
                "يونيو",
                "يوليو",
                "أغسطس",
                "سبتمبر",
                "أكتوبر",
                "نوفمبر",
                "ديسمبر"
            ],

            datasets:[{

                label:"قيمة الفواتير",

                data:values,

                borderWidth:1

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{
                    display:false
                }

            }

        }

    });

}
function exportExcel() {

    const table = document.querySelector("table");

    const workbook = XLSX.utils.table_to_book(table, {

        sheet: "Reports"

    });

    XLSX.writeFile(workbook, "Financial_Report.xlsx");

}
function printTable() {

    window.print();

}
async function exportPDF() {

    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF("l", "mm", "a4");

    pdf.setFontSize(18);

    pdf.text("K GROUP ERP REPORT", 14, 15);

    pdf.autoTable({

        html: "table",

        startY: 25,

        theme: "grid",

        styles: {

            fontSize: 9

        }

    });

    pdf.save("Financial_Report.pdf");

}
