// ======================================================
// K GROUP ERP
// Steel Dashboard
// Section 1
// ======================================================

import { db } from "./firebase.js";
collection,
    addDoc,
    getDocs,
    query,
    orderBy
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ======================================================
// Firestore Collections
// ======================================================

const rebarRef = collection(db, "steel_rebar");
const billetRef = collection(db, "steel_billet");

// ======================================================
// Main Elements
// ======================================================

const newOperation = document.getElementById("newOperation");
const operationModal = document.getElementById("operationModal");

const modal = new bootstrap.Modal(operationModal);

// ======================================================
// Form Elements
// ======================================================

const operationType = document.getElementById("operationType");
const operationInvoice = document.getElementById("operationInvoice");
const operationDate = document.getElementById("operationDate");

const operationSupplier = document.getElementById("operationSupplier");
const operationCustomer = document.getElementById("operationCustomer");

const receivedQty = document.getElementById("receivedQty");
const pricePerTon = document.getElementById("pricePerTon");
const totalValue = document.getElementById("totalValue");
const totalWeight = document.getElementById("totalWeight");

const borderCrossing = document.getElementById("borderCrossing");
const externalTransport = document.getElementById("externalTransport");
const customsCost = document.getElementById("customsCost");
const transferFees = document.getElementById("transferFees");

const supplierPayment = document.getElementById("supplierPayment");
const customerPayment = document.getElementById("customerPayment");
const customerWithdraw = document.getElementById("customerWithdraw");

const operationStatus = document.getElementById("operationStatus");
const operationNotes = document.getElementById("operationNotes");

// ======================================================
// Truck Table
// ======================================================

const truckItemsTable =
document.getElementById("truckItemsTable");

// ======================================================
// Start Page
// ======================================================

window.addEventListener("DOMContentLoaded", async () => {

    operationDate.value =
    new Date().toISOString().split("T")[0];

    await generateInvoiceNumber();

    await loadOperations();

    await loadDashboard();

});


// ======================================================
// Open Modal
// ======================================================

newOperation.addEventListener("click", async () => {

    operationDate.value =
    new Date().toISOString().split("T")[0];

    await generateInvoiceNumber();

    modal.show();

});

// ======================================================
// Add Rebar Button
// ======================================================

document
.getElementById("addRebar")
.addEventListener("click", async () => {

    operationType.value = "rebar";

    await generateInvoiceNumber();

    modal.show();

});

// ======================================================
// Add Billet Button
// ======================================================

document
.getElementById("addBillet")
.addEventListener("click", async () => {

    operationType.value = "billet";

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

    operationInvoice.value =
    `${prefix}-${new Date().getFullYear()}-${String(number).padStart(5,"0")}`;

}

operationType.addEventListener(
    "change",
    generateInvoiceNumber
);

// ======================================================
// Border Crossing
// ======================================================

borderCrossing.onchange = function () {

    if (this.value === "القائم") {

        externalTransport.value = 2900;

    } else if (this.value === "التنف") {

        externalTransport.value = 2700;

    } else {

        externalTransport.value = "";

    }

};
// ======================================================
// Trucks
// ======================================================

const addTruckBtn =
document.getElementById("addTruckRow");

addTruckBtn.addEventListener("click", addTruck);

function addTruck(){

    if(truckItemsTable.innerText.includes("لا توجد سيارات")){

        truckItemsTable.innerHTML = "";

    }

    const rowNo =
    truckItemsTable.rows.length + 1;

    const today =
    new Date().toISOString().split("T")[0];

    truckItemsTable.insertAdjacentHTML("beforeend",`

<tr>

<td>${rowNo}</td>

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

    refreshTruckEvents();

    calculateTotals();

}

// ======================================================
// Refresh Events
// ======================================================

function refreshTruckEvents(){

    document.querySelectorAll(".truckWeight").forEach(input=>{

        input.oninput = calculateTotals;

    });

}

// ======================================================
// Remove Truck
// ======================================================

truckItemsTable.addEventListener("click",(e)=>{

    if(!e.target.closest(".removeTruck")) return;

    e.target.closest("tr").remove();

    renumberRows();

    calculateTotals();

});

// ======================================================
// Renumber
// ======================================================

function renumberRows(){

    [...truckItemsTable.rows].forEach((row,index)=>{

        row.cells[0].textContent =
        index + 1;

    });

}

// ======================================================
// Calculate Totals
// ======================================================

function calculateTotals(){

    let totalWeightValue = 0;

    document.querySelectorAll(".truckWeight").forEach(input=>{

        totalWeightValue +=
        Number(input.value || 0);

    });

    totalWeight.textContent =
    totalWeightValue.toFixed(3);

    receivedQty.value =
    totalWeightValue.toFixed(3);

    const price =
    Number(pricePerTon.value || 0);

    totalValue.value =
    (price * totalWeightValue).toFixed(2);

}

// ======================================================
// Price Change
// ======================================================

pricePerTon.addEventListener(
    "input",
    calculateTotals
);
// ======================================================
// Save Operation
// ======================================================

document
.getElementById("saveOperation")
.addEventListener("click", saveOperation);

async function saveOperation(){

    try{

        const trucks = [];

        document
        .querySelectorAll("#truckItemsTable tr")
        .forEach(row=>{

            const weight =
            row.querySelector(".truckWeight");

            if(!weight) return;

            trucks.push({

                arrivalDate:
                row.querySelector(".arrivalDate").value,

                weight:
                Number(weight.value || 0)

            });

        });

        const data = {

            invoiceNumber:
            operationInvoice.value,

            type:
            operationType.value,

            date:
            operationDate.value,

            supplier:
            operationSupplier.value,

            customer:
            operationCustomer.value,

            receivedQty:
            Number(receivedQty.value || 0),

            totalWeight:
            Number(totalWeight.textContent || 0),

            pricePerTon:
            Number(pricePerTon.value || 0),

            totalValue:
            Number(totalValue.value || 0),

            borderCrossing:
            borderCrossing.value,

            externalTransport:
            Number(externalTransport.value || 0),

            customsCost:
            Number(customsCost.value || 0),

            transferFees:
            Number(transferFees.value || 0),

            supplierPayment:
            Number(supplierPayment.value || 0),

            customerPayment:
            Number(customerPayment.value || 0),

            customerWithdraw:
            Number(customerWithdraw.value || 0),

            status:
            operationStatus.value,

            notes:
            operationNotes.value,

            trucks:

            trucks,

            createdAt:

            new Date()

        };

        if(operationType.value === "rebar"){

            await addDoc(rebarRef,data);

        }else{

            await addDoc(billetRef,data);

        }

        alert("تم حفظ العملية بنجاح");

modal.hide();

clearOperationForm();

await generateInvoiceNumber();

await loadOperations();

await loadDashboard();
    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// ======================================================
// Clear Form
// ======================================================

function clearOperationForm(){

    operationSupplier.value = "";

    operationCustomer.value = "";

    receivedQty.value = "";

    totalWeight.textContent = "0.000";

    pricePerTon.value = "";

    totalValue.value = "";

    borderCrossing.value = "";

    externalTransport.value = "";

    customsCost.value = "";

    transferFees.value = "";

    supplierPayment.value = "";

    customerPayment.value = "";

    customerWithdraw.value = "";

    operationStatus.value = "مفتوحة";

    operationNotes.value = "";

    truckItemsTable.innerHTML = `

    <tr>

        <td colspan="5" class="text-center text-muted">

        لا توجد سيارات

        </td>

    </tr>

    `;

}
// ======================================================
// Tables
// ======================================================

const rebarTable =
document.getElementById("rebarTable");

const billetTable =
document.getElementById("billetTable");

// ======================================================
// Load Operations
// ======================================================

async function loadOperations(){

    await loadRebar();

    await loadBillet();

}

// ======================================================
// Load Rebar
// ======================================================

async function loadRebar(){

    rebarTable.innerHTML = "";

    const q =
    query(
        rebarRef,
        orderBy("createdAt","desc")
    );

    const snapshot =
    await getDocs(q);

    if(snapshot.empty){

        rebarTable.innerHTML=`

        <tr>

        <td colspan="18"
        class="text-center">

        لا توجد عمليات

        </td>

        </tr>

        `;

        return;

    }

    snapshot.forEach(doc=>{

        const d =
        doc.data();

        rebarTable.innerHTML += createRow(d);

    });

}

// ======================================================
// Load Billet
// ======================================================

async function loadBillet(){

    billetTable.innerHTML = "";

    const q =
    query(
        billetRef,
        orderBy("createdAt","desc")
    );

    const snapshot =
    await getDocs(q);

    if(snapshot.empty){

        billetTable.innerHTML=`

        <tr>

        <td colspan="18"
        class="text-center">

        لا توجد عمليات

        </td>

        </tr>

        `;

        return;

    }

    snapshot.forEach(doc=>{

        const d =
        doc.data();

        billetTable.innerHTML += createRow(d);

    });

}
// ======================================================
// Create Row
// ======================================================

function createRow(d){

    const balance =

    Number(d.customerPayment||0)

    -

    Number(d.customerWithdraw||0);

    return `

<tr>

<td>${d.date}</td>

<td>${d.supplier}</td>

<td>${d.customer}</td>

<td>${d.invoiceNumber}</td>

<td>${Number(d.totalWeight||0).toFixed(3)}</td>

<td>${Number(d.receivedQty||0).toFixed(3)}</td>

<td>${Number(d.pricePerTon||0).toLocaleString()}</td>

<td>${Number(d.totalValue||0).toLocaleString()}</td>

<td>${d.trucks?.length || 0}</td>

<td>${Number(d.totalWeight||0).toFixed(3)}</td>

<td>${Number(d.supplierPayment||0).toLocaleString()}</td>

<td>${Number(d.externalTransport||0).toLocaleString()}</td>

<td>${Number(d.customerPayment||0).toLocaleString()}</td>

<td>${Number(d.customerWithdraw||0).toLocaleString()}</td>

<td>${balance.toLocaleString()}</td>

<td>${d.status}</td>

<td>${d.notes || ""}</td>

<td>

<button
class="btn btn-warning btn-sm">

<i class="fa-solid fa-pen"></i>

</button>

</td>

</tr>

`;

}
// ======================================================
// Dashboard
// ======================================================

const rebarPurchases =
document.getElementById("rebarPurchases");

const billetPurchases =
document.getElementById("billetPurchases");

const totalPurchases =
document.getElementById("totalPurchases");

const totalSales =
document.getElementById("totalSales");

const totalProfit =
document.getElementById("totalProfit");

const balance =
document.getElementById("balance");

const cashBox =
document.getElementById("cashBox");

const customerBalanceName =
document.getElementById("customerBalanceName");

const customerBalanceAmount =
document.getElementById("customerBalanceAmount");

const customerDueName =
document.getElementById("customerDueName");

const customerDueAmount =
document.getElementById("customerDueAmount");

const totalImportExpenses =
document.getElementById("totalImportExpenses");

const customsTransportCard =
document.getElementById("customsTransportCard");
// ======================================================
// Load Dashboard
// ======================================================

async function loadDashboard(){

    let rebarPurchase = 0;
    let billetPurchase = 0;

    let sales = 0;

    let supplierPayments = 0;
    let customerPayments = 0;

    let transport = 0;
    let customs = 0;
    let transfer = 0;

    let customerBalances = {};
    let customerDues = {};

    // ----------------------------
    // Rebar
    // ----------------------------

    const rebarSnap =
    await getDocs(rebarRef);

    rebarSnap.forEach(doc=>{

        calculateDashboard(doc.data());

    });

    // ----------------------------
    // Billet
    // ----------------------------

    const billetSnap =
    await getDocs(billetRef);

    billetSnap.forEach(doc=>{

        calculateDashboard(doc.data());

    });

    // ----------------------------
    // Dashboard
    // ----------------------------

    rebarPurchases.textContent =
    rebarPurchase.toLocaleString();

    billetPurchases.textContent =
    billetPurchase.toLocaleString();

    totalPurchases.textContent =
    (rebarPurchase + billetPurchase).toLocaleString();

    totalSales.textContent =
    sales.toLocaleString();

    totalProfit.textContent =
    (
        sales
        -
        rebarPurchase
        -
        billetPurchase
        -
        transport
        -
        customs
        -
        transfer
    ).toLocaleString();

    balance.textContent =
    (
        customerPayments -
        supplierPayments
    ).toLocaleString();

    cashBox.textContent =
    customerPayments.toLocaleString();

    totalImportExpenses.textContent =
    (
        transport +
        transfer
    ).toLocaleString();

    customsTransportCard.textContent =
    customs.toLocaleString();

    // ----------------------------
    // Customer Balance
    // ----------------------------

    const balances =
    Object.entries(customerBalances);

    if(balances.length){

        customerBalanceName.textContent =
        balances[0][0];

        customerBalanceAmount.textContent =
        balances[0][1].toLocaleString()+" $";

    }

    const dues =
    Object.entries(customerDues);

    if(dues.length){

        customerDueName.textContent =
        dues[0][0];

        customerDueAmount.textContent =
        dues[0][1].toLocaleString()+" $";

    }

    // ----------------------------
    // Internal Function
    // ----------------------------

    function calculateDashboard(d){

        if(d.type==="rebar"){

            rebarPurchase +=
            Number(d.totalValue||0);

        }

        if(d.type==="billet"){

            billetPurchase +=
            Number(d.totalValue||0);

        }

        sales +=
        Number(d.customerWithdraw||0);

        supplierPayments +=
        Number(d.supplierPayment||0);

        customerPayments +=
        Number(d.customerPayment||0);

        transport +=
        Number(d.externalTransport||0);

        customs +=
        Number(d.customsCost||0);

        transfer +=
        Number(d.transferFees||0);

        const balanceValue =

        Number(d.customerPayment||0)

        -

        Number(d.customerWithdraw||0);

        if(balanceValue>=0){

            customerBalances[d.customer] =
            balanceValue;

        }else{

            customerDues[d.customer] =
            Math.abs(balanceValue);

        }

    }

}
