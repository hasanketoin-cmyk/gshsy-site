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
serverTimestamp
}
from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const paymentsRef = collection(db,"payments");

// =========================
// Collections
// =========================

const invoicesRef = collection(db,"invoices");
const suppliersRef = collection(db,"suppliers");
const sectionsRef = collection(db,"sections");

// =========================
// Elements
// =========================

const invoiceNumber=document.getElementById("invoiceNumber");
const invoiceDate=document.getElementById("invoiceDate");
const supplier=document.getElementById("supplier");
const section=document.getElementById("section");
const currency=document.getElementById("currency");
const amount=document.getElementById("amount");
const dueDate=document.getElementById("dueDate");
const notes=document.getElementById("notes");
const paymentStatus=document.getElementById("paymentStatus");
const firstPayment=document.getElementById("firstPayment");
const paymentDate=document.getElementById("paymentDate");
const paymentMethod=document.getElementById("paymentMethod");

const firstPaymentBox=document.getElementById("firstPaymentBox");
const paymentDateBox=document.getElementById("paymentDateBox");
const paymentMethodBox=document.getElementById("paymentMethodBox");

const saveInvoice=document.getElementById("saveInvoice");
const newInvoice=document.getElementById("newInvoice");
const editInvoice=document.getElementById("editInvoice");
const deleteInvoice=document.getElementById("deleteInvoice");

const invoiceTable=document.getElementById("invoiceTable");
const searchInvoice=document.getElementById("searchInvoice");

let selectedInvoiceId=null;

// =========================
// Start
// =========================

window.addEventListener("DOMContentLoaded",async()=>{

invoiceDate.value=new Date().toISOString().split("T")[0];

await loadSuppliers();
await loadSections();
  
await generateInvoiceNumber();

await loadInvoices();

});

saveInvoice.addEventListener("click",saveInvoiceData);
paymentStatus.addEventListener("change",()=>{

firstPaymentBox.style.display="none";
paymentDateBox.style.display="none";
paymentMethodBox.style.display="none";

if(paymentStatus.value==="paid"){

paymentDateBox.style.display="block";
paymentMethodBox.style.display="block";

}

if(paymentStatus.value==="partial"){

firstPaymentBox.style.display="block";
paymentDateBox.style.display="block";
paymentMethodBox.style.display="block";

}

});

newInvoice.addEventListener("click",()=>{

clearForm();

generateInvoiceNumber();

});

// =========================
// Invoice Number
// =========================

async function generateInvoiceNumber(){

const snap=await getDocs(invoicesRef);

invoiceNumber.value=
"INV-"+String(snap.size+1).padStart(5,"0");

}

// =========================
// Suppliers
// =========================

async function loadSuppliers(){

supplier.innerHTML=`<option value="">اختر المورد</option>`;

const snap=await getDocs(query(suppliersRef,orderBy("name")));

snap.forEach(docSnap=>{

const data=docSnap.data();

supplier.innerHTML+=`
<option value="${data.name}">
${data.name}
</option>
`;

});

}
// =========================
// Load Sections
// =========================

async function loadSections(){

const list=document.getElementById("sectionsList");

list.innerHTML="";

const snapshot=await getDocs(query(sectionsRef,orderBy("name")));

snapshot.forEach(docSnap=>{

const data=docSnap.data();

list.innerHTML+=`
<option value="${data.name}">
`;

});

}

// =========================
// Clear
// =========================

function clearForm(){

selectedInvoiceId=null;

invoiceDate.value=new Date().toISOString().split("T")[0];

supplier.value="";

section.selectedIndex=0;

currency.value="USD";

amount.value="";

dueDate.value="";

notes.value="";

}
// =========================
// Save Invoice
// =========================

async function saveInvoiceData(){

if(invoiceNumber.value.trim()==""){
alert("أدخل رقم الفاتورة");
return;
}

if(supplier.value==""){
alert("اختر المورد");
return;
}

if(amount.value==""){
alert("أدخل المبلغ");
return;
}

try{

 const sectionName=section.value.trim();

if(sectionName!=""){

const sections=await getDocs(sectionsRef);

let exists=false;

sections.forEach(item=>{

if(item.data().name===sectionName){

exists=true;

}

});

if(!exists){

await addDoc(sectionsRef,{

name:sectionName,

createdAt:serverTimestamp()

});

}

}
  
await addDoc(invoicesRef,{

number:invoiceNumber.value,

date:invoiceDate.value,

supplier:supplier.value,

section:section.value,

currency:currency.value,

amount:Number(amount.value),

paid:0,

remaining:Number(amount.value),

dueDate:dueDate.value,

notes:notes.value,

status:"غير مدفوعة",

createdAt:serverTimestamp()

});

alert("تم حفظ الفاتورة");

clearForm();

await generateInvoiceNumber();

await loadInvoices();

}

catch(error){

console.error(error);

alert(error.message);

}

}

// =========================
// Load Invoices
// =========================

async function loadInvoices(){

invoiceTable.innerHTML="";

const snap=await getDocs(query(invoicesRef,orderBy("createdAt","desc")));

if(snap.empty){

invoiceTable.innerHTML=`

<tr>

<td colspan="8" class="text-center">

لا توجد فواتير

</td>

</tr>

`;

return;

}

snap.forEach(docSnap=>{

const data=docSnap.data();

invoiceTable.innerHTML+=`

<tr>

<td>${data.number}</td>

<td>${data.date}</td>

<td>${data.supplier}</td>

<td>${data.section}</td>

<td>${data.currency}</td>

<td>${Number(data.amount).toLocaleString()}</td>

<td>${data.dueDate??"-"}</td>

<td>

<button
class="btn btn-warning btn-sm"
onclick="editInvoiceData('${docSnap.id}')">

<i class="fa-solid fa-pen"></i>

</button>

<button
class="btn btn-danger btn-sm"
onclick="deleteInvoiceData('${docSnap.id}')">

<i class="fa-solid fa-trash"></i>

</button>

</td>

</tr>

`;

});

}
// =========================
// Edit Invoice
// =========================

window.editInvoiceData = async function(id){

selectedInvoiceId=id;

const snap=await getDoc(doc(db,"invoices",id));

if(!snap.exists()) return;

const data=snap.data();

invoiceNumber.value=data.number;
invoiceDate.value=data.date;
supplier.value=data.supplier;
section.value=data.section;
currency.value=data.currency;
amount.value=data.amount;
dueDate.value=data.dueDate || "";
notes.value=data.notes || "";

}

// =========================
// Update Invoice
// =========================

editInvoice.addEventListener("click",async()=>{

if(!selectedInvoiceId){

alert("اختر فاتورة أولاً");

return;

}

try{

await updateDoc(doc(db,"invoices",selectedInvoiceId),{

number:invoiceNumber.value,
date:invoiceDate.value,
supplier:supplier.value,
section:section.value,
currency:currency.value,
amount:Number(amount.value),
remaining:Number(amount.value),
dueDate:dueDate.value,
notes:notes.value

});

alert("تم تعديل الفاتورة");

clearForm();

await loadInvoices();

await generateInvoiceNumber();

}

catch(error){

console.error(error);

alert(error.message);

}

});

// =========================
// Delete Invoice
// =========================

window.deleteInvoiceData = async function(id){

if(!confirm("هل تريد حذف الفاتورة؟")) return;

try{

await deleteDoc(doc(db,"invoices",id));

alert("تم حذف الفاتورة");

clearForm();

await loadInvoices();

await generateInvoiceNumber();

}

catch(error){

console.error(error);

alert(error.message);

}

}

// =========================
// Search
// =========================

searchInvoice.addEventListener("keyup",function(){

const value=this.value.toLowerCase();

invoiceTable.querySelectorAll("tr").forEach(row=>{

row.style.display=row.innerText.toLowerCase().includes(value)
? ""
: "none";

});

});
