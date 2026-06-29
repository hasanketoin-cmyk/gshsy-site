import { db } from "./firebase.js";

import {
    collection,
    getDocs,
    doc,
    getDoc
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

import { auth } from "./firebase.js";
const invoicesRef = collection(db, "invoices");
const suppliersRef = collection(db, "suppliers");
const settingsRef = doc(db, "settings", "company");

loadDashboard();

async function loadDashboard() {

    const invoices = await getDocs(invoicesRef);
    const suppliers = await getDocs(suppliersRef);
// ======================
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
    animateCounter("totalInvoices", invoices.size);

    animateCounter("totalSuppliers", suppliers.size);

    animateCounter("totalPaid", 0);

    animateCounter("totalDue", 0);

    animateCounter("todayInvoices", 0);

    animateCounter("todayPayments", 0);

    animateCounter("weekDue", 0);

    document.getElementById("progress").innerHTML = "0%";

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
