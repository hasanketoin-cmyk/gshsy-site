import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc,
    query,
    orderBy
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";
import { auth } from "./firebase.js";
const invoicesRef = collection(db, "invoices");
const suppliersRef = collection(db, "suppliers");
const paymentsRef = collection(db, "payments");
const settingsRef = doc(db, "settings", "company");

loadDashboard();

async function loadDashboard() {

    const invoices = await getDocs(invoicesRef);
const suppliers = await getDocs(
    query(suppliersRef, orderBy("name"))
);

const payments = await getDocs(
    query(paymentsRef, orderBy("createdAt", "desc"))
);// ======================
// Company Settings
// ======================

const settingsSnap = await getDoc(settingsRef);

if (settingsSnap.exists()) {

    const settings = settingsSnap.data();

   const companyNameEl = document.getElementById("sidebarCompanyName");
const systemNameEl = document.getElementById("sidebarSystemName");
const dashboardCompanyEl = document.getElementById("dashboardCompany");

if (companyNameEl) {
    companyNameEl.textContent = settings.companyName || "K GROUP";
}

if (systemNameEl) {
    systemNameEl.textContent = settings.systemName || "ERP Financial System";
}

if (dashboardCompanyEl) {
    dashboardCompanyEl.textContent = settings.companyName || "";
}

}
    // ======================
// Current User
// ======================

if (auth.currentUser) {

   const userEl = document.getElementById("dashboardUserName");

if (userEl && auth.currentUser) {
    userEl.textContent = auth.currentUser.email;
}
}
    // ======================
// Dashboard Statistics
// ======================

let totalPaid = 0;
let totalDue = 0;

let totalPaidSYP = 0;
let totalDueSYP = 0;

let todayPayments = 0;
let todayPaymentsSYP = 0;
    
let weekDue = 0;

let paidInvoices = 0;

const today = new Date();

today.setHours(0,0,0,0);

const nextWeek = new Date();

nextWeek.setDate(nextWeek.getDate()+7);

// ======================
// Invoices
// ======================

invoices.forEach(docSnap=>{

    const invoice = docSnap.data();
    console.log("Currency:", invoice.currency, "Paid:", invoice.paid);

    const amount = Number(invoice.amount || 0);

  const paid = Number(invoice.paid || 0);

const remaining = Number(invoice.remaining || 0);

if (invoice.currency === "USD") {

    totalPaid += paid;
    totalDue += remaining;

}

else if (invoice.currency === "SYP") {

    totalPaidSYP += paid;
    totalDueSYP += remaining;

}
    if(remaining<=0 && amount>0){

        paidInvoices++;

    }

    if(invoice.date){

        const invoiceDate = new Date(invoice.date);

        invoiceDate.setHours(0,0,0,0);

        if(invoiceDate.getTime()===today.getTime()){

            todayInvoices++;

        }

    }

    if(invoice.dueDate){

        const due = new Date(invoice.dueDate);

        if(

            due>=today &&
            due<=nextWeek &&
            remaining>0

        ){

            weekDue += remaining;

        }

    }

});

    console.log("==========");
console.log("USD Paid:", totalPaid);
console.log("USD Due:", totalDue);

console.log("SYP Paid:", totalPaidSYP);
console.log("SYP Due:", totalDueSYP);
console.log("==========");
    
// ======================
// Payments
// ======================

payments.forEach(docSnap=>{

    const payment = docSnap.data();

    if(payment.paymentDate){

        const paymentDate = new Date(payment.paymentDate);

        paymentDate.setHours(0,0,0,0);

        if(paymentDate.getTime()===today.getTime()){

            if(payment.currency === "USD"){

                todayPayments += Number(payment.paymentAmount || 0);

            }

            else if(payment.currency === "SYP"){

                todayPaymentsSYP += Number(payment.paymentAmount || 0);

            }

        }

    }

});
// ======================
// Cards
// ======================

animateCounter("totalInvoices", invoices.size);

animateCounter("totalSuppliers", suppliers.size);

animateCounter("totalPaid", totalPaid);
animateCounter("totalDue", totalDue);

animateCounter("totalPaidSYP", totalPaidSYP);
animateCounter("totalDueSYP", totalDueSYP);

animateCounter("todayPayments", todayPayments);
animateCounter("todayPaymentsSYP", todayPaymentsSYP);
    
animateCounter("weekDue", weekDue);

const progress = invoices.size===0

?0

:Math.round(

(paidInvoices/invoices.size)*100

);

document.getElementById("progress").innerHTML=

progress+"%";
    
}  
function animateCounter(id, target) {

    let obj = document.getElementById(id);

    if (!obj) return;

    let current = 0;

    let speed = target / 40;

    if (speed < 1) speed = 1;

    let timer = setInterval(() => {

        current += speed;

        if (current >= target) {

            current = target;

            clearInterval(timer);

        }

        obj.innerHTML = Math.floor(current).toLocaleString();

    }, 20);

}
