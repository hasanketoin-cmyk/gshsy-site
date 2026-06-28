import { db } from "./firebase.js";

import {
    doc,
    getDoc,
    setDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// =========================
// Reference
// =========================

const settingsRef = doc(db, "settings", "company");

// =========================
// Elements
// =========================

const companyName = document.getElementById("companyName");
const companyEmail = document.getElementById("companyEmail");
const companyPhone = document.getElementById("companyPhone");
const companyAddress = document.getElementById("companyAddress");
const defaultCurrency = document.getElementById("defaultCurrency");
const systemName = document.getElementById("systemName");
const timeZone = document.getElementById("timeZone");
const companyLogo = document.getElementById("companyLogo");

const saveSettings = document.getElementById("saveSettings");

// =========================
// Start
// =========================

loadSettings();

saveSettings.addEventListener("click", saveCompanySettings);

// =========================
// Load Settings
// =========================

async function loadSettings() {

    try {

        const snap = await getDoc(settingsRef);

        if (!snap.exists()) return;

        const data = snap.data();

        companyName.value = data.companyName || "";
        companyEmail.value = data.companyEmail || "";
        companyPhone.value = data.companyPhone || "";
        companyAddress.value = data.companyAddress || "";
        defaultCurrency.value = data.defaultCurrency || "USD";
        systemName.value = data.systemName || "K GROUP ERP";
        timeZone.value = data.timeZone || "Asia/Damascus";
        companyLogo.value = data.companyLogo || "";

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// =========================
// Save Settings
// =========================

async function saveCompanySettings() {

    try {

        await setDoc(settingsRef, {

            companyName: companyName.value,

            companyEmail: companyEmail.value,

            companyPhone: companyPhone.value,

            companyAddress: companyAddress.value,

            defaultCurrency: defaultCurrency.value,

            systemName: systemName.value,

            timeZone: timeZone.value,

            companyLogo: companyLogo.value,

            updatedAt: serverTimestamp()

        });

        alert("تم حفظ الإعدادات بنجاح");

    }

    catch (error) {

        console.error(error);

        alert(error.message);

    }

}
