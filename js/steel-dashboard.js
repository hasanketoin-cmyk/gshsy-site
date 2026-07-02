import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ======================================================
// Collections
// ======================================================

const rebarRef = collection(db, "steel_rebar");
const billetRef = collection(db, "steel_billet");

// ======================================================
// Main Elements
// ======================================================

const newOperation = document.getElementById("newOperation");
const operationModal = document.getElementById("operationModal");

const modal = new bootstrap.Modal(operationModal);

// Dashboard

const rebarTable = document.getElementById("rebarTable");
const billetTable = document.getElementById("billetTable");

// Dashboard Cards

const customerBalanceName =
document.getElementById("customerBalanceName");

const customerBalanceAmount =
document.getElementById("customerBalanceAmount");

const customerDueName =
document.getElementById("customerDueName");

const customerDueAmount =
document.getElementById("customerDueAmount");

// Operation Form

const operationType =
document.getElementById("operationType");

const operationInvoice =
document.getElementById("operationInvoice");

const operationDate =
document.getElementById("operationDate");

const operationSupplier =
document.getElementById("operationSupplier");

const operationCustomer =
document.getElementById("operationCustomer");

const receivedQty =
document.getElementById("receivedQty");

const pricePerTon =
document.getElementById("pricePerTon");

const totalValue =
document.getElementById("totalValue");

const totalWeight =
document.getElementById("totalWeight");

const borderCrossing =
document.getElementById("borderCrossing");

const externalTransport =
document.getElementById("externalTransport");

const customsCost =
document.getElementById("customsCost");

const transferFees =
document.getElementById("transferFees");

const supplierPayment =
document.getElementById("supplierPayment");

const customerPayment =
document.getElementById("customerPayment");

const customerWithdraw =
document.getElementById("customerWithdraw");

const operationStatus =
document.getElementById("operationStatus");

const operationNotes =
document.getElementById("operationNotes");

console.log("receivedQty:", receivedQty);
console.log("borderCrossing:", borderCrossing);
console.log("externalTransport:", externalTransport);
console.log("customsCost:", customsCost);
console.log("transferFees:", transferFees);
console.log("totalValue:", totalValue);

// ======================================================
// Page Start
// ======================================================

DOMContentLoaded

// ======================================================
// Open New Operation
// ======================================================

newOperation.addEventListener("click",async()=>{

    operationDate.value =
    new Date().toISOString().split("T")[0];

    await generateInvoiceNumber();

    modal.show();

});
// ======================================================
// Generate Invoice Number
// ======================================================

async function generateInvoiceNumber(){

    const ref =
    operationType.value === "rebar"
    ? rebarRef
    : billetRef;

    const prefix =
    operationType.value === "rebar"
    ? "RB"
    : "BL";

    const snapshot =
    await getDocs(ref);

    const number =
    snapshot.size + 1;

    const year =
    new Date().getFullYear();

    operationInvoice.value =
    `${prefix}-${year}-${String(number).padStart(5,"0")}`;

}

operationType.addEventListener(
"change",
generateInvoiceNumber
);

// ======================================================
// Border Crossing
// ======================================================

borderCrossing.addEventListener("change",()=>{

    switch(borderCrossing.value){

        case "القائم":

            externalTransport.value = 2900;

            break;

        case "التنف":

            externalTransport.value = 2700;

            break;

        default:

            externalTransport.value = "";

    }

});

// ======================================================
// Save Operation
// ======================================================

document
.getElementById("saveOperation")
.addEventListener("click",saveOperation);

async function saveOperation(){

    console.log({
        operationInvoice,
        operationDate,
        operationSupplier,
        operationCustomer,
        receivedQty,
        totalWeight,
        pricePerTon,
        totalValue,
        borderCrossing,
        externalTransport,
        customsCost,
        transferFees,
        supplierPayment,
        customerPayment,
        customerWithdraw,
        operationStatus,
        operationNotes
    });

    try{

        const data={
            invoiceNumber:
            operationInvoice.value,

            date:
            operationDate.value,

            supplier:
            operationSupplier.value,

            customer:
            operationCustomer.value,

            receivedQty:
            Number(receivedQty.value||0),

            totalWeight:
            Number(totalWeight.textContent||0),

            pricePerTon:
            Number(pricePerTon.value||0),

            totalValue:
            Number(totalValue.value||0),

            borderCrossing:
            borderCrossing.value,

            externalTransport:
            Number(externalTransport.value||0),

            customsCost:
            Number(customsCost.value||0),

            transferFees:
            Number(transferFees.value||0),

            supplierPayment:
            Number(supplierPayment.value||0),

            customerPayment:
            Number(customerPayment.value||0),

            customerWithdraw:
            Number(customerWithdraw.value||0),

            status:
            operationStatus.value,

            notes:
            operationNotes.value,

            createdAt:
            new Date()

        };

        if(operationType.value==="rebar"){

            await addDoc(rebarRef,data);

        }else{

            await addDoc(billetRef,data);

        }

        alert("تم حفظ العملية بنجاح");

        modal.hide();

        await loadOperations();

        await generateInvoiceNumber();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// ======================================================
// Trucks
// ======================================================

const addTruckBtn =
document.getElementById("addTruckRow");

const truckTable =
document.getElementById("truckItemsTable");

let trucks = [];

// ======================================================
// Add Truck
// ======================================================

addTruckBtn.addEventListener("click",addTruck);

function addTruck(){

    if(truckTable.innerText.includes("لا توجد سيارات")){

        truckTable.innerHTML="";

    }

    const row =
    truckTable.rows.length + 1;

    const today =
    new Date().toISOString().split("T")[0];

    truckTable.insertAdjacentHTML("beforeend",`

    <tr>

        <td>${row}</td>

        <td>

            <input
            type="date"
            class="form-control arrivalDate"
            value="${today}">

        </td>

        <td>

            <input
            type="number"
            class="form-control truckWeight"
            step="0.001"
            value="0">

        </td>

        <td>

            <input
            type="file"
            class="form-control truckCard"
            accept="image/*">

        </td>

        <td>

            <button
            type="button"
            class="btn btn-danger removeTruck">

            <i class="fa-solid fa-trash"></i>

            </button>

        </td>

    </tr>

    `);

    bindTruckEvents();

}
// ======================================================
// Truck Events
// ======================================================

function bindTruckEvents(){

    document.querySelectorAll(".truckWeight").forEach(input=>{

        input.removeEventListener("input",calculateTotals);

        input.addEventListener("input",calculateTotals);

    });

}
// ======================================================
// Remove Truck
// ======================================================

truckTable.addEventListener("click",(e)=>{

    if(!e.target.closest(".removeTruck")) return;

    e.target.closest("tr").remove();

    updateTruckNumbers();

    calculateTotals();

});
// ======================================================
// Update Numbers
// ======================================================

function updateTruckNumbers(){

    [...truckTable.rows].forEach((row,index)=>{

        row.cells[0].textContent =
        index + 1;

    });

}
// ======================================================
// Calculate Totals
// ======================================================

function calculateTotals(){

    let total = 0;

    document.querySelectorAll(".truckWeight").forEach(input=>{

        total += Number(input.value || 0);

    });

    totalWeight.textContent =
    total.toFixed(3);

    totalValue.value =
    (
        total *
        Number(pricePerTon.value || 0)
    ).toFixed(2);

}
pricePerTon.addEventListener(
"input",
calculateTotals
);
// ======================================================
// Load Operations
// ======================================================

async function loadOperations(){

    await loadRebar();

    await loadBillet();

    await loadCustomerDashboard();

    await loadExpensesDashboard();

}
// ======================================================
// Load Rebar
// ======================================================

async function loadRebar(){

    rebarTable.innerHTML="";

    const snapshot =
    await getDocs(
        query(
            rebarRef,
            orderBy("createdAt","desc")
        )
    );

    if(snapshot.empty){

        rebarTable.innerHTML=`

        <tr>

        <td colspan="18">

        لا توجد عمليات

        </td>

        </tr>

        `;

        return;

    }

    snapshot.forEach(doc=>{

        const d=doc.data();

        rebarTable.innerHTML+=`

        <tr>

        <td>${d.date}</td>

        <td>${d.supplier}</td>

        <td>${d.customer}</td>

        <td>${d.invoiceNumber}</td>

        <td>${Number(d.totalWeight||0).toFixed(3)}</td>

        <td>${Number(d.receivedQty||0).toFixed(3)}</td>

        <td>${Number(d.pricePerTon).toLocaleString()}</td>

        <td>${Number(d.totalValue).toLocaleString()}</td>

        <td>-</td>

        <td>-</td>

        <td>${Number(d.supplierPayment).toLocaleString()}</td>

        <td>${Number(d.externalTransport).toLocaleString()}</td>

        <td>${Number(d.customerPayment).toLocaleString()}</td>

        <td>${Number(d.customerWithdraw).toLocaleString()}</td>

        <td>-</td>

        <td>${d.status}</td>

        <td>${d.notes}</td>

        <td>

        <button
        class="btn btn-warning btn-sm">

        <i class="fa-solid fa-pen"></i>

        </button>

        </td>

        </tr>

        `;

    });

}
// ======================================================
// Load Billet
// ======================================================

async function loadBillet(){

    billetTable.innerHTML="";

    const snapshot =
    await getDocs(
        query(
            billetRef,
            orderBy("createdAt","desc")
        )
    );

    if(snapshot.empty){

        billetTable.innerHTML=`

        <tr>

        <td colspan="18">

        لا توجد عمليات

        </td>

        </tr>

        `;

        return;

    }

    snapshot.forEach(doc=>{

        const d=doc.data();

        billetTable.innerHTML+=`

        <tr>

        <td>${d.date}</td>

        <td>${d.supplier}</td>

        <td>${d.customer}</td>

        <td>${d.invoiceNumber}</td>

        <td>${Number(d.totalWeight||0).toFixed(3)}</td>

        <td>${Number(d.receivedQty||0).toFixed(3)}</td>

        <td>${Number(d.pricePerTon).toLocaleString()}</td>

        <td>${Number(d.totalValue).toLocaleString()}</td>

        <td>-</td>

        <td>-</td>

        <td>${Number(d.supplierPayment).toLocaleString()}</td>

        <td>${Number(d.externalTransport).toLocaleString()}</td>

        <td>${Number(d.customerPayment).toLocaleString()}</td>

        <td>${Number(d.customerWithdraw).toLocaleString()}</td>

        <td>-</td>

        <td>${d.status}</td>

        <td>${d.notes}</td>

        <td>

        <button
        class="btn btn-warning btn-sm">

        <i class="fa-solid fa-pen"></i>

        </button>

        </td>

        </tr>

        `;

    });

}
// ======================================================
// Dashboard
// ======================================================

async function loadDashboard(){

    let rebarPurchase = 0;
    let billetPurchase = 0;

    let totalSales = 0;

    let totalProfit = 0;

    let totalSupplierPayments = 0;

    let totalCustomerPayments = 0;

    let totalExternalTransport = 0;

    let totalCustoms = 0;

    let totalTransfer = 0;

    // ===========================
    // Rebar
    // ===========================

    const rebarSnapshot = await getDocs(rebarRef);

    rebarSnapshot.forEach(doc=>{

        const d = doc.data();

        rebarPurchase += Number(d.totalValue||0);

        totalSales += Number(d.customerWithdraw||0);

        totalSupplierPayments +=
        Number(d.supplierPayment||0);

        totalCustomerPayments +=
        Number(d.customerPayment||0);

        totalExternalTransport +=
        Number(d.externalTransport||0);

        totalCustoms +=
        Number(d.customsCost||0);

        totalTransfer +=
        Number(d.transferFees||0);

    });

    // ===========================
    // Billet
    // ===========================

    const billetSnapshot = await getDocs(billetRef);

    billetSnapshot.forEach(doc=>{

        const d = doc.data();

        billetPurchase += Number(d.totalValue||0);

        totalSales += Number(d.customerWithdraw||0);

        totalSupplierPayments +=
        Number(d.supplierPayment||0);

        totalCustomerPayments +=
        Number(d.customerPayment||0);

        totalExternalTransport +=
        Number(d.externalTransport||0);

        totalCustoms +=
        Number(d.customsCost||0);

        totalTransfer +=
        Number(d.transferFees||0);

    });

    // ===========================
    // Totals
    // ===========================

    const totalPurchases =
    rebarPurchase +
    billetPurchase;

    const totalExpenses =
    totalExternalTransport +
    totalCustoms +
    totalTransfer;

    totalProfit =
    totalSales -
    totalPurchases -
    totalExpenses;

    // ===========================
    // Dashboard Cards
    // ===========================

    document.getElementById("rebarPurchases").textContent =
    rebarPurchase.toLocaleString();

    document.getElementById("billetPurchases").textContent =
    billetPurchase.toLocaleString();

    document.getElementById("totalPurchases").textContent =
    totalPurchases.toLocaleString();

    document.getElementById("totalSales").textContent =
    totalSales.toLocaleString();

    document.getElementById("totalProfit").textContent =
    totalProfit.toLocaleString();

    document.getElementById("cashBox").textContent =
    totalCustomerPayments.toLocaleString();

    document.getElementById("balance").textContent =
    (
        totalCustomerPayments -
        totalSupplierPayments
    ).toLocaleString();

    document.getElementById("totalImportExpenses").textContent =
    (
        totalExternalTransport +
        totalTransfer
    ).toLocaleString();

    document.getElementById("customsTransportCard").textContent =
    totalCustoms.toLocaleString();

}
