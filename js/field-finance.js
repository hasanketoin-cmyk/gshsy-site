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
const hours = document.getElementById("hours");
const notes = document.getElementById("notes");

const saveIncome = document.getElementById("saveIncome");
const newIncome = document.getElementById("newIncome");

const incomeTable = document.getElementById("incomeTable");

const todayIncome = document.getElementById("todayIncome");
const weekIncome = document.getElementById("weekIncome");
const monthIncome = document.getElementById("monthIncome");
const yearIncome = document.getElementById("yearIncome");

const todayHours = document.getElementById("todayHours");
const occupancy = document.getElementById("occupancy");

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
// Save Income
// ===========================

async function saveIncomeData(){

    if(grossIncome.value==""){

        alert("أدخل الإيراد");

        return;

    }

    if(hours.value==""){

        alert("أدخل ساعات التشغيل");

        return;

    }

    try{

        await addDoc(incomeRef,{

            date:incomeDate.value,

            field:field.value,

            currency:currency.value,

            grossIncome:Number(grossIncome.value),

            discount:Number(discount.value),

            netIncome:Number(netIncome.value),

            hours:Number(hours.value),

            notes:notes.value,

            createdAt:Timestamp.now()

        });

        alert("تم حفظ الإيراد");

        clearForm();

        loadIncome();

    }

    catch(error){

        console.error(error);

        alert(error.message);

    }

}
// ===========================
// Clear Form
// ===========================

function clearForm(){

    selectedId=null;

    incomeDate.value=new Date().toISOString().split("T")[0];

    field.value="ملعب 1";

    currency.value="SYP";

    grossIncome.value="";

    discount.value="0";

    netIncome.value="0";

    hours.value="";

    notes.value="";

}
// ===========================
// Load Income
// ===========================

async function loadIncome(){

    incomeTable.innerHTML="";

    const q=query(
        incomeRef,
        orderBy("date","desc")
    );

    const snapshot=await getDocs(q);

    if(snapshot.empty){

        incomeTable.innerHTML=`

<tr>

<td colspan="9" class="text-center">

لا توجد بيانات

</td>

</tr>

`;

        return;

    }

    snapshot.forEach(docSnap=>{

        const data=docSnap.data();

        incomeTable.innerHTML+=`

<tr>

<td>${data.date}</td>

<td>${data.field}</td>

<td>${data.currency}</td>

<td>${Number(data.grossIncome).toLocaleString()}</td>

<td>${Number(data.discount).toLocaleString()}</td>

<td>${Number(data.netIncome).toLocaleString()}</td>

<td>${data.hours}</td>

<td>${data.notes||"-"}</td>

<td>

<button
class="btn btn-warning btn-sm"
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
// Edit Income
// ===========================

window.editIncome = async function(id){

    selectedId=id;

    const snap=await getDoc(doc(db,"fieldIncome",id));

    if(!snap.exists()) return;

    const data=snap.data();

    incomeDate.value=data.date;
    field.value=data.field;
    currency.value=data.currency;

    grossIncome.value=data.grossIncome;
    discount.value=data.discount;
    netIncome.value=data.netIncome;

    hours.value=data.hours;
    notes.value=data.notes;

}

// ===========================
// Delete Income
// ===========================

window.deleteIncome = async function(id){

    if(!confirm("هل تريد حذف السجل؟")) return;

    try{

        await deleteDoc(doc(db,"fieldIncome",id));

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

    const snapshot=await getDocs(incomeRef);

    let todayTotal=0;
    let weekTotal=0;
    let monthTotal=0;
    let yearTotal=0;

    let hoursTotal=0;

    const today=new Date();

    const weekAgo=new Date();
    weekAgo.setDate(today.getDate()-6);

    snapshot.forEach(docSnap=>{

        const data=docSnap.data();

        const value=Number(data.netIncome||0);

        const hrs=Number(data.hours||0);

        const d=new Date(data.date);

        if(d.toDateString()===today.toDateString()){

            todayTotal+=value;

            hoursTotal+=hrs;

        }

        if(d>=weekAgo){

            weekTotal+=value;

        }

        if(
            d.getMonth()===today.getMonth() &&
            d.getFullYear()===today.getFullYear()
        ){

            monthTotal+=value;

        }

        if(d.getFullYear()===today.getFullYear()){

            yearTotal+=value;

        }

    });

    todayIncome.innerHTML=todayTotal.toLocaleString();

    weekIncome.innerHTML=weekTotal.toLocaleString();

    monthIncome.innerHTML=monthTotal.toLocaleString();

    yearIncome.innerHTML=yearTotal.toLocaleString();

    todayHours.innerHTML=hoursTotal;

    // ملعبان × 12 ساعة = 24 ساعة

    const occupancyRate=
        Math.round((hoursTotal/24)*100);

    occupancy.innerHTML=occupancyRate+"%";

}
