// ======================================================
// K GROUP ERP
// Steel Dashboard v2.0
// Section 1
// ======================================================

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
// Firestore Collections
// ======================================================

const rebarRef =
collection(db,"steel_rebar");

const billetRef =
collection(db,"steel_billet");

// ======================================================
// Main Elements
// ======================================================

const newOperation =
document.getElementById("newOperation");

const operationModal =
document.getElementById("operationModal");

const modal =
new bootstrap.Modal(operationModal);

// ======================================================
// Form Elements
// ======================================================

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

// ======================================================
// Tables
// ======================================================

const rebarTable =
document.getElementById("rebarTable");

const billetTable =
document.getElementById("billetTable");

const truckItemsTable =
document.getElementById("truckItemsTable");

// ======================================================
// Dashboard Cards
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
// Page Start
// ======================================================

window.addEventListener("DOMContentLoaded", async()=>{

    operationDate.value =
    new Date().toISOString().split("T")[0];

    await generateInvoiceNumber();

    await loadOperations();

});

// ======================================================
// New Operation
// ======================================================

newOperation.addEventListener("click",async()=>{

    operationDate.value =
    new Date().toISOString().split("T")[0];

    await generateInvoiceNumber();

    modal.show();

});

// ======================================================
// Invoice Number
// ======================================================

async function generateInvoiceNumber(){

    const ref =
    operationType.value==="rebar"
    ? rebarRef
    : billetRef;

    const prefix =
    operationType.value==="rebar"
    ? "RB"
    : "BL";

    const snapshot =
    await getDocs(ref);

    operationInvoice.value =
    `${prefix}-${new Date().getFullYear()}-${String(snapshot.size+1).padStart(5,"0")}`;

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

    try{

        const trucks=[];

        document.querySelectorAll("#truckItemsTable tr").forEach(row=>{

            const weight=
            row.querySelector(".truckWeight");

            if(!weight) return;

            trucks.push({

                arrivalDate:
                row.querySelector(".arrivalDate").value,

                weight:
                Number(weight.value||0)

            });

        });

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

            trucks,

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

await generateInvoiceNumber();

await loadOperations();

truckItemsTable.innerHTML = `
<tr>
<td colspan="5" class="text-center text-muted">
لا توجد سيارات
</td>
</tr>
`;

totalWeight.textContent = "0.000";

totalValue.value = "";

receivedQty.value = "";

pricePerTon.value = "";

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

addTruckBtn.addEventListener(
"click",
addTruck
);

function addTruck(){

    if(truckItemsTable.innerText.includes("لا توجد سيارات")){

        truckItemsTable.innerHTML="";

    }

    const today=
    new Date().toISOString().split("T")[0];

    const rowNumber=
    truckItemsTable.rows.length+1;

    truckItemsTable.insertAdjacentHTML("beforeend",`

<tr>

<td>${rowNumber}</td>

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

        input.oninput=calculateTotals;

    });

}

truckItemsTable.addEventListener("click",(e)=>{

    if(!e.target.closest(".removeTruck")) return;

    e.target.closest("tr").remove();

    updateTruckNumbers();

    calculateTotals();

});

function updateTruckNumbers(){

    [...truckItemsTable.rows].forEach((row,index)=>{

        row.cells[0].textContent=index+1;

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

    const price =
    Number(pricePerTon.value || 0);

    totalValue.value =
    (total * price).toFixed(2);

    receivedQty.value =
    total.toFixed(3);

}
// ======================================================
// Load Operations
// ======================================================

async function loadOperations(){

    await loadRebar();

    await loadBillet();

    await loadDashboard();

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
            <td colspan="18" class="text-center">
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

            <td>${Number(d.pricePerTon||0).toLocaleString()}</td>

            <td>${Number(d.totalValue||0).toLocaleString()}</td>

            <td>${d.trucks ? d.trucks.length : 0}</td>

            <td>${Number(d.totalWeight||0).toFixed(3)}</td>

            <td>${Number(d.supplierPayment||0).toLocaleString()}</td>

            <td>${Number(d.externalTransport||0).toLocaleString()}</td>

            <td>${Number(d.customerPayment||0).toLocaleString()}</td>

            <td>${Number(d.customerWithdraw||0).toLocaleString()}</td>

            <td>${(
                Number(d.customerPayment||0)
                -
                Number(d.customerWithdraw||0)
            ).toLocaleString()}</td>

            <td>${d.status}</td>

            <td>${d.notes||""}</td>

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
            <td colspan="18" class="text-center">
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

            <td>${Number(d.pricePerTon||0).toLocaleString()}</td>

            <td>${Number(d.totalValue||0).toLocaleString()}</td>

            <td>${d.trucks ? d.trucks.length : 0}</td>

            <td>${Number(d.totalWeight||0).toFixed(3)}</td>

            <td>${Number(d.supplierPayment||0).toLocaleString()}</td>

            <td>${Number(d.externalTransport||0).toLocaleString()}</td>

            <td>${Number(d.customerPayment||0).toLocaleString()}</td>

            <td>${Number(d.customerWithdraw||0).toLocaleString()}</td>

            <td>${(
                Number(d.customerPayment||0)
                -
                Number(d.customerWithdraw||0)
            ).toLocaleString()}</td>

            <td>${d.status}</td>

            <td>${d.notes||""}</td>

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

    let rebarTotal=0;
    let billetTotal=0;
    let sales=0;
    let supplierPayments=0;
    let customerPayments=0;
    let transport=0;
    let customs=0;
    let transfer=0;

    const rebarSnap=await getDocs(rebarRef);

    rebarSnap.forEach(doc=>{

        const d=doc.data();

        rebarTotal+=Number(d.totalValue||0);
        sales+=Number(d.customerWithdraw||0);
        supplierPayments+=Number(d.supplierPayment||0);
        customerPayments+=Number(d.customerPayment||0);
        transport+=Number(d.externalTransport||0);
        customs+=Number(d.customsCost||0);
        transfer+=Number(d.transferFees||0);

    });

    const billetSnap=await getDocs(billetRef);

    billetSnap.forEach(doc=>{

        const d=doc.data();

        billetTotal+=Number(d.totalValue||0);
        sales+=Number(d.customerWithdraw||0);
        supplierPayments+=Number(d.supplierPayment||0);
        customerPayments+=Number(d.customerPayment||0);
        transport+=Number(d.externalTransport||0);
        customs+=Number(d.customsCost||0);
        transfer+=Number(d.transferFees||0);

    });

    rebarPurchases.textContent =
    rebarTotal.toLocaleString();

    billetPurchases.textContent =
    billetTotal.toLocaleString();

    totalPurchases.textContent =
    (rebarTotal+billetTotal).toLocaleString();

    totalSales.textContent =
    sales.toLocaleString();

    totalProfit.textContent =
    (
        sales
        -
        rebarTotal
        -
        billetTotal
        -
        transport
        -
        customs
        -
        transfer
    ).toLocaleString();

    balance.textContent =
    (
        customerPayments
        -
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

}
