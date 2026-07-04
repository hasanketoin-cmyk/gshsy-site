/*****************************************************************
 *
 * K GROUP ERP
 * Steel Dashboard
 * Version 1.0
 *
 *****************************************************************/

/* ============================================================
   Firebase
============================================================ */

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";

import {
    getFirestore,
    collection,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    getDocs,
    getDoc,
    onSnapshot,
    query,
    orderBy,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";


import {
    getAuth
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";


/* ============================================================
   Firebase Config
============================================================ */

const firebaseConfig = {

    apiKey: "...",

    authDomain: "...",

    projectId: "...",

    storageBucket: "...",

    messagingSenderId: "...",

    appId: "..."

};


/* ============================================================
   Initialize
============================================================ */

const app = initializeApp(firebaseConfig);

const db = getFirestore(app);

const auth = getAuth(app);


/* ============================================================
   Collections
============================================================ */

const rebarRef = collection(db, "steel_rebar");

const billetRef = collection(db, "steel_billet");

const trucksRef = collection(db, "steel_trucks");

const suppliersRef = collection(db, "suppliers");

const customersRef = collection(db, "steel_customers");

const financeRef = collection(db, "finance");


/* ============================================================
   Variables
============================================================ */

let editID = null;

let truckCounter = 0;

let truckItems = [];

let currentOperation = "rebar";


/* ============================================================
   DOM
============================================================ */

const modalElement = document.getElementById("operationModal");

const modal = new bootstrap.Modal(modalElement);

const operationDate = document.getElementById("operationDate");

const operationInvoice = document.getElementById("operationInvoice");

const operationType = document.getElementById("operationType");

const saveButton = document.getElementById("saveOperation");

const addTruckRow = document.getElementById("addTruckRow");

const totalWeight = document.getElementById("totalWeight");

const receivedQty = document.getElementById("receivedQty");

const pricePerTon = document.getElementById("pricePerTon");

const totalValue = document.getElementById("totalValue");

const truckTable = document.getElementById("truckItemsTable");


/* ============================================================
   Dashboard Cards
============================================================ */

const rebarPurchases = document.getElementById("rebarPurchases");

const billetPurchases = document.getElementById("billetPurchases");

const totalPurchases = document.getElementById("totalPurchases");

const totalSales = document.getElementById("totalSales");

const totalProfit = document.getElementById("totalProfit");

const balance = document.getElementById("balance");

const cashBox = document.getElementById("cashBox");

const bank = document.getElementById("bank");

const totalImportExpenses =
document.getElementById("totalImportExpenses");

const customsTransportCard =
document.getElementById("customsTransportCard");


/* ============================================================
   Today
============================================================ */

function today() {

    const d = new Date();

    const year = d.getFullYear();

    const month = String(d.getMonth() + 1).padStart(2, "0");

    const day = String(d.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;

}

operationDate.value = today();


/* ============================================================
   Invoice Generator
============================================================ */

function generateInvoiceNumber() {

    const now = new Date();

    const y = now.getFullYear();

    const m = String(now.getMonth() + 1).padStart(2, "0");

    const d = String(now.getDate()).padStart(2, "0");

    const r = Math.floor(Math.random() * 9000 + 1000);

    return `ST-${y}${m}${d}-${r}`;

}

operationInvoice.value = generateInvoiceNumber();


/* ============================================================
   Open Modal
============================================================ */

document
.getElementById("newOperation")
.addEventListener("click", () => {

    editID = null;

    clearForm();

    operationDate.value = today();

    operationInvoice.value =
        generateInvoiceNumber();

    modal.show();

});


document
.getElementById("addRebar")
.addEventListener("click", () => {

    operationType.value = "rebar";

    modal.show();

});


document
.getElementById("addBillet")
.addEventListener("click", () => {

    operationType.value = "billet";

    modal.show();

});


/* ============================================================
   Auto Calculate
============================================================ */

receivedQty.addEventListener("input", calculateTotal);

pricePerTon.addEventListener("input", calculateTotal);

function calculateTotal() {

    const qty = Number(receivedQty.value) || 0;

    const price = Number(pricePerTon.value) || 0;

    totalValue.value = (qty * price).toFixed(2);

}
/* ============================================================
   Truck Management
============================================================ */

function refreshTruckTable() {

    truckTable.innerHTML = "";

    if (truckItems.length === 0) {

        truckTable.innerHTML = `
        <tr>
            <td colspan="5" class="text-center">
                لا توجد سيارات
            </td>
        </tr>`;

        totalWeight.textContent = "0.000";
        return;
    }

    let total = 0;

    truckItems.forEach((truck, index) => {

        total += Number(truck.weight);

        const row = document.createElement("tr");

        row.innerHTML = `
            <td>${index + 1}</td>

            <td>
                <input
                    type="date"
                    class="form-control truck-date"
                    value="${truck.date}">
            </td>

            <td>
                <input
                    type="number"
                    class="form-control truck-weight"
                    step="0.001"
                    value="${truck.weight}">
            </td>

            <td>
                <input
                    type="file"
                    class="form-control truck-scale"
                    accept="image/*,.pdf">
            </td>

            <td>
                <button
                    type="button"
                    class="btn btn-danger btn-sm removeTruck">
                    🗑
                </button>
            </td>
        `;

        truckTable.appendChild(row);

        const dateInput = row.querySelector(".truck-date");
        const weightInput = row.querySelector(".truck-weight");
        const removeBtn = row.querySelector(".removeTruck");

        dateInput.addEventListener("change", () => {
            truckItems[index].date = dateInput.value;
        });

        weightInput.addEventListener("input", () => {

            truckItems[index].weight = Number(weightInput.value) || 0;

            let sum = 0;

            truckItems.forEach(t => {
                sum += Number(t.weight);
            });

            totalWeight.textContent = sum.toFixed(3);

        });

        removeBtn.addEventListener("click", () => {

            truckItems.splice(index,1);

            refreshTruckTable();

        });

    });

    totalWeight.textContent = total.toFixed(3);

}
/* ============================================================
   Remove Truck
============================================================ */

window.removeTruck = function(index){

    if(!confirm("هل تريد حذف السيارة؟"))
        return;

    truckItems.splice(index,1);

    refreshTruckTable();

}


/* ============================================================
   Add Truck
============================================================ */

addTruckRow.addEventListener("click", () => {

    truckItems.push({
        date: today(),
        weight: 0,
        scaleCard: ""
    });

    refreshTruckTable();

});

/* ============================================================
   Validate Truck Weight
============================================================ */

function validateWeights(){

    let total=0;

    truckItems.forEach(t=>{

        total+=Number(t.weight);

    });

    const qty=Number(receivedQty.value)||0;

    if(total>qty){

        alert("إجمالي أوزان السيارات أكبر من الكمية المستلمة");

        return false;

    }

    return true;

}
/* ============================================================
   Save Operation
============================================================ */

saveButton.addEventListener("click", saveOperation);

async function saveOperation() {

    try {

        if (!validateForm()) return;

        if (!validateWeights()) return;

        const operation = {

            type: operationType.value,

            date: operationDate.value,

            invoice: operationInvoice.value,

            supplier: document.getElementById("operationSupplier").value,

            customer: document.getElementById("operationCustomer").value,

            receivedQty: Number(receivedQty.value),

            pricePerTon: Number(pricePerTon.value),

            totalValue: Number(totalValue.value),

            supplierPayment: Number(document.getElementById("supplierPayment").value || 0),

            customerPayment: Number(document.getElementById("customerPayment").value || 0),

            customerWithdraw: Number(document.getElementById("customerWithdraw").value || 0),

            externalTransport: Number(document.getElementById("externalTransport").value || 0),

            customsCost: Number(document.getElementById("customsCost").value || 0),

            transferFees: Number(document.getElementById("transferFees").value || 0),

            borderCrossing: document.getElementById("borderCrossing").value,

            status: document.getElementById("operationStatus").value,

            notes: document.getElementById("operationNotes").value,

            trucks: truckItems,

            createdAt: Timestamp.now()

        };

        if (operation.type === "rebar") {

            await addDoc(rebarRef, operation);

        } else {

            await addDoc(billetRef, operation);

        }

        alert("تم حفظ العملية بنجاح");

        modal.hide();

        clearForm();

        loadDashboard();

        loadRebarTable();

        loadBilletTable();

    } catch (error) {

        console.error(error);

        alert("حدث خطأ أثناء الحفظ");

    }

}
/* ============================================================
   Validate Form
============================================================ */

function validateForm() {
   
console.log(document.getElementById("operationSupplier"));
console.log(document.getElementById("operationSupplier").value);
   
   if (document.getElementById("operationSupplier").value === "") {

        alert("اختر المورد");

        return false;

    }

    if (document.getElementById("operationCustomer").value === "") {

        alert("اختر الزبون");

        return false;

    }

    if (receivedQty.value === "") {

        alert("أدخل الكمية");

        return false;

    }

    if (pricePerTon.value === "") {

        alert("أدخل سعر الطن");

        return false;

    }

    if (truckItems.length === 0) {

        alert("يجب إضافة سيارة واحدة على الأقل");

        return false;

    }

    return true;

}
/* ============================================================
   Dashboard
============================================================ */

async function loadDashboard() {

    let rebarTotal = 0;

    let billetTotal = 0;

    let sales = 0;

    let supplierPayments = 0;

    let customerPayments = 0;

    let transportExpenses = 0;

    let customsExpenses = 0;

    const rebarSnapshot = await getDocs(rebarRef);

    rebarSnapshot.forEach(doc => {

        const data = doc.data();

        rebarTotal += Number(data.totalValue);

        supplierPayments += Number(data.supplierPayment);

        customerPayments += Number(data.customerPayment);

        transportExpenses += Number(data.externalTransport);

        customsExpenses += Number(data.customsCost);

    });

    const billetSnapshot = await getDocs(billetRef);

    billetSnapshot.forEach(doc => {

        const data = doc.data();

        billetTotal += Number(data.totalValue);

        supplierPayments += Number(data.supplierPayment);

        customerPayments += Number(data.customerPayment);

        transportExpenses += Number(data.externalTransport);

        customsExpenses += Number(data.customsCost);

    });

    const purchases = rebarTotal + billetTotal;

    sales = customerPayments;

    const profit = sales - purchases;

    rebarPurchases.textContent = rebarTotal.toLocaleString();

    billetPurchases.textContent = billetTotal.toLocaleString();

    totalPurchases.textContent = purchases.toLocaleString();

    totalSales.textContent = sales.toLocaleString();

    totalProfit.textContent = profit.toLocaleString();

    cashBox.textContent = customerPayments.toLocaleString();

    balance.textContent = (customerPayments - supplierPayments).toLocaleString();

    bank.textContent = supplierPayments.toLocaleString();

    totalImportExpenses.textContent = transportExpenses.toLocaleString();

    customsTransportCard.textContent = customsExpenses.toLocaleString();

}
/* ============================================================
   Start
============================================================ */

window.addEventListener("load", () => {

    loadDashboard();

    loadRebarTable();

    loadBilletTable();

});
/* ============================================================
   Load Rebar Table
============================================================ */

async function loadRebarTable() {

    const tbody = document.getElementById("rebarTable");

    tbody.innerHTML = "";

    const q = query(rebarRef, orderBy("createdAt", "desc"));

    const snapshot = await getDocs(q);

    if (snapshot.empty) {

        tbody.innerHTML = `
        <tr>
            <td colspan="18" class="text-center text-muted">
                لا توجد عمليات حتى الآن
            </td>
        </tr>`;

        return;
    }

    snapshot.forEach(docSnap => {

        const data = docSnap.data();

        const id = docSnap.id;

        const balance =
            Number(data.customerPayment || 0)
            -
            Number(data.customerWithdraw || 0);

        tbody.innerHTML += `

<tr>

<td>${data.date}</td>

<td>${data.supplier}</td>

<td>${data.customer}</td>

<td>${data.invoice}</td>

<td>${Number(data.receivedQty).toFixed(3)}</td>

<td>${Number(data.receivedQty).toFixed(3)}</td>

<td>${Number(data.pricePerTon).toLocaleString()}</td>

<td>${Number(data.totalValue).toLocaleString()}</td>

<td>${data.trucks.length}</td>

<td>${averageTruckWeight(data.trucks)}</td>

<td>${Number(data.supplierPayment).toLocaleString()}</td>

<td>${Number(data.externalTransport).toLocaleString()}</td>

<td>${Number(data.customerPayment).toLocaleString()}</td>

<td>${Number(data.customerWithdraw).toLocaleString()}</td>

<td>${balance.toLocaleString()}</td>

<td>

<span class="badge ${statusColor(data.status)}">

${data.status}

</span>

</td>

<td>${data.notes}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editOperation('${id}','rebar')">

<i class="fa fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteOperation('${id}','rebar')">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}
/* ============================================================
   Load Billet Table
============================================================ */

async function loadBilletTable() {

    const tbody = document.getElementById("billetTable");

    tbody.innerHTML = "";

    const q = query(billetRef, orderBy("createdAt","desc"));

    const snapshot = await getDocs(q);

    if(snapshot.empty){

        tbody.innerHTML=`
        <tr>
        <td colspan="18" class="text-center">
        لا توجد عمليات
        </td>
        </tr>`;

        return;
    }

    snapshot.forEach(docSnap=>{

        const data=docSnap.data();

        const id=docSnap.id;

        const balance=
        Number(data.customerPayment||0)
        -
        Number(data.customerWithdraw||0);

tbody.innerHTML+=`

<tr>

<td>${data.date}</td>

<td>${data.supplier}</td>

<td>${data.customer}</td>

<td>${data.invoice}</td>

<td>${data.receivedQty}</td>

<td>${data.receivedQty}</td>

<td>${Number(data.pricePerTon).toLocaleString()}</td>

<td>${Number(data.totalValue).toLocaleString()}</td>

<td>${data.trucks.length}</td>

<td>${averageTruckWeight(data.trucks)}</td>

<td>${Number(data.supplierPayment).toLocaleString()}</td>

<td>${Number(data.externalTransport).toLocaleString()}</td>

<td>${Number(data.customerPayment).toLocaleString()}</td>

<td>${Number(data.customerWithdraw).toLocaleString()}</td>

<td>${balance.toLocaleString()}</td>

<td>

<span class="badge ${statusColor(data.status)}">

${data.status}

</span>

</td>

<td>${data.notes}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editOperation('${id}','billet')">

<i class="fa fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteOperation('${id}','billet')">

<i class="fa fa-trash"></i>

</button>

</td>

</tr>

`;

    });

}
function averageTruckWeight(trucks){

    if(trucks.length===0)
        return 0;

    let total=0;

    trucks.forEach(t=>{

        total+=Number(t.weight);

    });

    return (total/trucks.length).toFixed(3);

}
function statusColor(status){

switch(status){

case "مفتوحة":

return "bg-primary";

case "قيد التنفيذ":

return "bg-warning text-dark";

case "مكتملة":

return "bg-success";

case "ملغاة":

return "bg-danger";

default:

return "bg-secondary";

}

}
window.deleteOperation=async function(id,type){

if(!confirm("هل تريد حذف العملية؟"))
return;

if(type==="rebar"){

await deleteDoc(doc(db,"steel_rebar",id));

loadRebarTable();

}

else{

await deleteDoc(doc(db,"steel_billet",id));

loadBilletTable();

}

loadDashboard();

}
/* ============================================================
   Edit Operation
============================================================ */

window.editOperation = async function(id, type){

    try{

        editID = id;

        currentOperation = type;

        const reference =
            type==="rebar"
            ? doc(db,"steel_rebar",id)
            : doc(db,"steel_billet",id);

        const snap = await getDoc(reference);

        if(!snap.exists()){

            alert("العملية غير موجودة");

            return;

        }

        const data = snap.data();

        operationType.value = data.type;

        operationDate.value = data.date;

        operationInvoice.value = data.invoice;

        document.getElementById("operationSupplier").value =
        data.supplier;

        document.getElementById("operationCustomer").value =
        data.customer;

        receivedQty.value = data.receivedQty;

        pricePerTon.value = data.pricePerTon;

        totalValue.value = data.totalValue;

        document.getElementById("supplierPayment").value =
        data.supplierPayment;

        document.getElementById("customerPayment").value =
        data.customerPayment;

        document.getElementById("customerWithdraw").value =
        data.customerWithdraw;

        document.getElementById("externalTransport").value =
        data.externalTransport;

        document.getElementById("customsCost").value =
        data.customsCost;

        document.getElementById("transferFees").value =
        data.transferFees;

        document.getElementById("borderCrossing").value =
        data.borderCrossing;

        document.getElementById("operationStatus").value =
        data.status;

        document.getElementById("operationNotes").value =
        data.notes;

        truckItems = data.trucks || [];

        refreshTruckTable();

        modal.show();

    }

    catch(error){

        console.log(error);

        alert("خطأ أثناء تحميل العملية");

    }

}
const searchRebar =
document.getElementById("searchRebar");

searchRebar.addEventListener("keyup",()=>{

const filter =
searchRebar.value.toLowerCase();

const rows =
document.querySelectorAll("#rebarTable tr");

rows.forEach(row=>{

row.style.display =
row.innerText.toLowerCase().includes(filter)
?
""
:
"none";

});

});
const searchBillet =
document.getElementById("searchBillet");

searchBillet.addEventListener("keyup",()=>{

const filter =
searchBillet.value.toLowerCase();

const rows =
document.querySelectorAll("#billetTable tr");

rows.forEach(row=>{

row.style.display =
row.innerText.toLowerCase().includes(filter)
?
""
:
"none";

});

});
const searchTruck =
document.getElementById("searchTruck");

searchTruck.addEventListener("keyup",()=>{

const filter =
searchTruck.value.toLowerCase();

const rows =
document.querySelectorAll("#truckTable tr");

rows.forEach(row=>{

row.style.display =
row.innerText.toLowerCase().includes(filter)
?
""
:
"none";

});

});

/* ============================================================
   Clear Form
============================================================ */

function clearForm() {

    truckItems = [];

    if (typeof refreshTruckTable === "function") {
        refreshTruckTable();
    }

    const ids = [
        "operationSupplier",
        "operationCustomer",
        "receivedQty",
        "pricePerTon",
        "totalValue",
        "supplierPayment",
        "customerPayment",
        "customerWithdraw",
        "externalTransport",
        "customsCost",
        "transferFees",
        "operationNotes"
    ];

    ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) el.value = "";
    });

    const border = document.getElementById("borderCrossing");
    if (border) border.selectedIndex = 0;

    const status = document.getElementById("operationStatus");
    if (status) status.selectedIndex = 0;
}
async function loadSuppliers() {

    const select = document.getElementById("operationSupplier");

    select.innerHTML = `<option value="">اختر المورد</option>`;

    const snapshot = await getDocs(suppliersRef);

    snapshot.forEach(doc => {

        const supplier = doc.data();

        select.innerHTML += `
            <option value="${supplier.name}">
                ${supplier.name}
            </option>
        `;

    });

}
async function loadCustomers() {

    const select = document.getElementById("operationCustomer");

    select.innerHTML = `<option value="">اختر الزبون</option>`;

    const snapshot = await getDocs(customersRef);

    snapshot.forEach(doc => {

        const customer = doc.data();

        select.innerHTML += `
            <option value="${customer.name}">
                ${customer.name}
            </option>
        `;

    });

}
window.addEventListener("load", () => {

    loadDashboard();

    loadRebarTable();

    loadBilletTable();

    loadSuppliers();

    loadCustomers();

});
