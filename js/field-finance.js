import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    orderBy,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ===========================
// Collection
// ===========================

const incomeRef = collection(db, "fieldIncome");

// ===========================
// Elements
// ===========================

const incomeDate = document.getElementById("incomeDate");
const field = document.getElementById("field");
const currency = document.getElementById("currency");

const grossIncome = document.getElementById("grossIncome");
const discount = document.getElementById("discount");
const netIncome = document.getElementById("netIncome");
const notes = document.getElementById("notes");

const saveIncome = document.getElementById("saveIncome");
const newIncome = document.getElementById("newIncome");

const incomeTable = document.getElementById("incomeTable");

let selectedId = null;

// ===========================
// Start
// ===========================

incomeDate.value = new Date().toISOString().split("T")[0];

calculateNetIncome();

loadIncome();

grossIncome.addEventListener("input", calculateNetIncome);
discount.addEventListener("input", calculateNetIncome);

saveIncome.addEventListener("click", saveIncomeData);

newIncome.addEventListener("click", clearForm);

// ===========================
// حساب الإيراد النهائي
// ===========================

function calculateNetIncome(){

    const gross = Number(grossIncome.value || 0);

    const disc = Number(discount.value || 0);

    netIncome.value = gross - disc;

}

// ===========================
// حفظ أو تعديل
// ===========================

async function saveIncomeData(){

    if(grossIncome.value===""){

        alert("أدخل إجمالي الإيراد");

        return;

    }

    try{

        const data={

            date:incomeDate.value,

            field:field.value,

            currency:currency.value,

            grossIncome:Number(grossIncome.value),

            discount:Number(discount.value),

            netIncome:Number(netIncome.value),

            notes:notes.value

        };

        if(selectedId){

            await updateDoc(
                doc(db,"fieldIncome",selectedId),
                data
            );

            alert("تم تحديث الإيراد");

        }else{

            data.createdAt = Timestamp.now();

            await addDoc(incomeRef,data);

            alert("تم حفظ الإيراد");

        }

        clearForm();

        loadIncome();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}

// ===========================
// تنظيف النموذج
// ===========================

function clearForm(){

    selectedId = null;

    incomeDate.value =
        new Date().toISOString().split("T")[0];

    field.value = "إيراد الملعبين";

    currency.value = "SYP";

    grossIncome.value = "";

    discount.value = "0";

    netIncome.value = "0";

    notes.value = "";

}
// ===========================
// تحميل الإيرادات
// ===========================

async function loadIncome(){

    incomeTable.innerHTML = "";

    const q = query(
        incomeRef,
        orderBy("date","desc")
    );

    const snapshot = await getDocs(q);

    if(snapshot.empty){

        incomeTable.innerHTML = `

<tr>

<td colspan="8" class="text-center text-muted">

لا توجد بيانات

</td>

</tr>

`;

        loadStatistics();

        return;

    }

    snapshot.forEach(docSnap=>{

        const data = docSnap.data();

        incomeTable.innerHTML += `

<tr>

<td>${data.date}</td>

<td>${data.field}</td>

<td>${data.currency}</td>

<td>${Number(data.grossIncome || 0).toLocaleString()}</td>

<td>${Number(data.discount || 0).toLocaleString()}</td>

<td>${Number(data.netIncome || 0).toLocaleString()}</td>

<td>${data.notes || "-"}</td>

<td>

<button
class="btn btn-warning btn-sm me-1"
onclick="editIncome('${docSnap.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteIncome('${docSnap.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

    });

    loadStatistics();

}

// ===========================
// تعديل سجل
// ===========================

window.editIncome = async function(id){

    selectedId = id;

    const snap = await getDoc(
        doc(db,"fieldIncome",id)
    );

    if(!snap.exists()) return;

    const data = snap.data();

    incomeDate.value = data.date;

    field.value = data.field;

    currency.value = data.currency;

    grossIncome.value = data.grossIncome;

    discount.value = data.discount;

    netIncome.value = data.netIncome;

    notes.value = data.notes || "";

}

// ===========================
// حذف سجل
// ===========================

window.deleteIncome = async function(id){

    if(!confirm("هل تريد حذف هذا السجل؟"))
        return;

    try{

        await deleteDoc(
            doc(db,"fieldIncome",id)
        );

        alert("تم حذف السجل");

        loadIncome();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// ===========================
// Dashboard Statistics
// ===========================

async function loadStatistics(){

    const snapshot = await getDocs(incomeRef);

    let todayUSD = 0;
    let weekUSD = 0;
    let monthUSD = 0;
    let yearUSD = 0;

    let todaySYP = 0;
    let weekSYP = 0;
    let monthSYP = 0;
    let yearSYP = 0;

    let totalDays = 0;

    const today = new Date();
    today.setHours(0,0,0,0);

    const weekAgo = new Date();
    weekAgo.setHours(0,0,0,0);
    weekAgo.setDate(today.getDate()-6);

    snapshot.forEach(docSnap=>{

        const data = docSnap.data();

        const value = Number(data.netIncome || 0);

        const date = new Date(data.date);
        date.setHours(0,0,0,0);

        totalDays++;

        if(data.currency==="USD"){

            if(date.getTime()===today.getTime())
                todayUSD += value;

            if(date>=weekAgo)
                weekUSD += value;

            if(
                date.getMonth()===today.getMonth() &&
                date.getFullYear()===today.getFullYear()
            )
                monthUSD += value;

            if(date.getFullYear()===today.getFullYear())
                yearUSD += value;

        }else{

            if(date.getTime()===today.getTime())
                todaySYP += value;

            if(date>=weekAgo)
                weekSYP += value;

            if(
                date.getMonth()===today.getMonth() &&
                date.getFullYear()===today.getFullYear()
            )
                monthSYP += value;

            if(date.getFullYear()===today.getFullYear())
                yearSYP += value;

        }

    });

    document.getElementById("todayIncomeUSD").innerHTML =
        todayUSD.toLocaleString();

    document.getElementById("weekIncomeUSD").innerHTML =
        weekUSD.toLocaleString();

    document.getElementById("monthIncomeUSD").innerHTML =
        monthUSD.toLocaleString();

    document.getElementById("yearIncomeUSD").innerHTML =
        yearUSD.toLocaleString();

    document.getElementById("todayIncomeSYP").innerHTML =
        todaySYP.toLocaleString();

    document.getElementById("weekIncomeSYP").innerHTML =
        weekSYP.toLocaleString();

    document.getElementById("monthIncomeSYP").innerHTML =
        monthSYP.toLocaleString();

    document.getElementById("yearIncomeSYP").innerHTML =
        yearSYP.toLocaleString();

    document.getElementById("daysCount").innerHTML =
        totalDays;

    const averageIncome =
        totalDays === 0
            ? 0
            : Math.round((yearUSD + yearSYP) / totalDays);

    document.getElementById("averageIncome").innerHTML =
        averageIncome.toLocaleString();

}

// ===========================
// البحث داخل الجدول
// ===========================

const searchIncome =
document.getElementById("searchIncome");

if(searchIncome){

    searchIncome.addEventListener("keyup",function(){

        const filter =
            this.value.toLowerCase();

        const rows =
            incomeTable.querySelectorAll("tr");

        rows.forEach(row=>{

            row.style.display =
                row.innerText.toLowerCase().includes(filter)
                ? ""
                : "none";

        });

    });

}

// ===========================
// زر Excel (مؤقت)
// ===========================

const exportBtn =
document.getElementById("exportExcel");

if(exportBtn){

    exportBtn.addEventListener("click",()=>{

        alert("سيتم إضافة تصدير Excel في الخطوة القادمة.");

    });

}
// ===========================
// Dashboard Statistics
// ===========================

async function loadStatistics(){

    const snapshot = await getDocs(incomeRef);

    let todayUSD = 0;
    let weekUSD = 0;
    let monthUSD = 0;
    let yearUSD = 0;

    let todaySYP = 0;
    let weekSYP = 0;
    let monthSYP = 0;
    let yearSYP = 0;

    let totalDays = 0;

    const today = new Date();
    today.setHours(0,0,0,0);

    const weekAgo = new Date();
    weekAgo.setHours(0,0,0,0);
    weekAgo.setDate(today.getDate()-6);

    snapshot.forEach(docSnap=>{

        const data = docSnap.data();

        const value = Number(data.netIncome || 0);

        const date = new Date(data.date);
        date.setHours(0,0,0,0);

        totalDays++;

        if(data.currency==="USD"){

            if(date.getTime()===today.getTime())
                todayUSD += value;

            if(date>=weekAgo)
                weekUSD += value;

            if(
                date.getMonth()===today.getMonth() &&
                date.getFullYear()===today.getFullYear()
            )
                monthUSD += value;

            if(date.getFullYear()===today.getFullYear())
                yearUSD += value;

        }else{

            if(date.getTime()===today.getTime())
                todaySYP += value;

            if(date>=weekAgo)
                weekSYP += value;

            if(
                date.getMonth()===today.getMonth() &&
                date.getFullYear()===today.getFullYear()
            )
                monthSYP += value;

            if(date.getFullYear()===today.getFullYear())
                yearSYP += value;

        }

    });

    document.getElementById("todayIncomeUSD").innerHTML =
        todayUSD.toLocaleString();

    document.getElementById("weekIncomeUSD").innerHTML =
        weekUSD.toLocaleString();

    document.getElementById("monthIncomeUSD").innerHTML =
        monthUSD.toLocaleString();

    document.getElementById("yearIncomeUSD").innerHTML =
        yearUSD.toLocaleString();

    document.getElementById("todayIncomeSYP").innerHTML =
        todaySYP.toLocaleString();

    document.getElementById("weekIncomeSYP").innerHTML =
        weekSYP.toLocaleString();

    document.getElementById("monthIncomeSYP").innerHTML =
        monthSYP.toLocaleString();

    document.getElementById("yearIncomeSYP").innerHTML =
        yearSYP.toLocaleString();

    document.getElementById("daysCount").innerHTML =
        totalDays;

    const averageIncome =
        totalDays === 0
            ? 0
            : Math.round((yearUSD + yearSYP) / totalDays);

    document.getElementById("averageIncome").innerHTML =
        averageIncome.toLocaleString();

}

// ===========================
// البحث داخل الجدول
// ===========================

const searchIncome =
document.getElementById("searchIncome");

if(searchIncome){

    searchIncome.addEventListener("keyup",function(){

        const filter =
            this.value.toLowerCase();

        const rows =
            incomeTable.querySelectorAll("tr");

        rows.forEach(row=>{

            row.style.display =
                row.innerText.toLowerCase().includes(filter)
                ? ""
                : "none";

        });

    });

}

// ===========================
// زر Excel (مؤقت)
// ===========================

const exportBtn =
document.getElementById("exportExcel");

if(exportBtn){

    exportBtn.addEventListener("click",()=>{

        alert("سيتم إضافة تصدير Excel في الخطوة القادمة.");

    });

}
