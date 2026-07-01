import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ===============================
// Collections
// ===============================

const rebarRef = collection(db, "steel_rebar");
const billetRef = collection(db, "steel_billet");

// ===============================
// Elements
// ===============================

const newOperation =
document.getElementById("newOperation");

const operationModal =
document.getElementById("operationModal");

// ===============================
// Bootstrap Modal
// ===============================

const modal =
new bootstrap.Modal(operationModal);

// ===============================
// Open Modal
// ===============================

newOperation.addEventListener("click", async () => {

    document.getElementById("operationDate").value =
    new Date().toISOString().split("T")[0];

    await generateInvoiceNumber();

    modal.show();

});
// =====================================
// Default Date
// =====================================

document.getElementById("operationDate").value =
new Date().toISOString().split("T")[0];
// =====================================
// Generate Invoice Number
// =====================================

async function generateInvoiceNumber() {

    const type =
    document.getElementById("operationType").value;

    let ref;

    let prefix;

    if (type === "rebar") {

        ref = rebarRef;

        prefix = "RB";

    } else {

        ref = billetRef;

        prefix = "BL";

    }

    const snapshot = await getDocs(ref);

    const number = snapshot.size + 1;

    const year = new Date().getFullYear();

    document.getElementById("operationInvoice").value =

        `${prefix}-${year}-${String(number).padStart(5, "0")}`;

}
document.getElementById("operationType")
.addEventListener("change", generateInvoiceNumber);
// ===============================
// Save Operation
// ===============================

document.getElementById("saveOperation")
.addEventListener("click", saveOperation);

async function saveOperation(){

    alert("save clicked");

    try{

        const type =
        document.getElementById("operationType").value;

        const data = {

            invoiceNumber:
            document.getElementById("operationInvoice").value,

            date:
            document.getElementById("operationDate").value,

            supplier:
            document.getElementById("operationSupplier").value,

            customer:
            document.getElementById("operationCustomer").value,

            pricePerTon:
            Number(document.getElementById("pricePerTon").value),

            transportCost:
            Number(document.getElementById("transportCost").value),

            supplierPayment:
            Number(document.getElementById("supplierPayment").value),

            customerPayment:
            Number(document.getElementById("customerPayment").value),

            customerWithdraw:
            Number(document.getElementById("customerWithdraw").value),

            status:
            document.getElementById("operationStatus").value,

            notes:
            document.getElementById("operationNotes").value,

            createdAt:
            new Date()

        };

        if(type==="rebar"){

            await addDoc(rebarRef,data);

        }else{

            await addDoc(billetRef,data);

        }

        alert("تم حفظ العملية بنجاح");

        modal.hide();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// =====================================
// Add Truck
// =====================================

const addTruckBtn = document.getElementById("addTruckRow");
const truckTable = document.getElementById("truckItemsTable");

addTruckBtn.addEventListener("click", addTruck);

function addTruck() {

    if (truckTable.innerHTML.includes("لا توجد سيارات")) {
        truckTable.innerHTML = "";
    }

    const today = new Date().toISOString().split("T")[0];

    truckTable.innerHTML += `
    <tr>

        <td>

            <input
            type="date"
            class="form-control"
            value="${today}">

        </td>

        <td>

            <input
            type="number"
            class="form-control truckWeight"
            step="0.001">

        </td>

        <td>

            <input
            type="file"
            class="form-control"
            accept="image/*">

        </td>

        <td>

            <button
            class="btn btn-danger removeTruck">

            حذف

            </button>

        </td>

    </tr>
    `;

}
