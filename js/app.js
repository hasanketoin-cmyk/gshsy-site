// ===============================
// K GROUP ERP
// Invoice System
// ===============================

let invoices = [];

// إنشاء فاتورة جديدة
document.getElementById("newInvoice")?.addEventListener("click", () => {

    document.getElementById("invoiceNumber").value = "";
    document.getElementById("invoiceDate").value = "";
    document.getElementById("supplier").selectedIndex = 0;
    document.getElementById("dueDate").value = "";
    document.getElementById("notes").value = "";

    const amount = document.querySelector('input[type="number"]');
    if(amount) amount.value = "";

});

// حفظ فاتورة
document.getElementById("saveInvoice")?.addEventListener("click", saveInvoice);

function saveInvoice(){

    const invoice = {

        number: document.getElementById("invoiceNumber").value,

        date: document.getElementById("invoiceDate").value,

        supplier: document.getElementById("supplier").value,

        section: document.querySelectorAll(".form-select")[1].value,

        currency: document.querySelectorAll(".form-select")[2].value,

        amount: document.querySelector('input[type="number"]').value,

        due: document.getElementById("dueDate").value

    };

    if(invoice.number==""){

        alert("يرجى إدخال رقم الفاتورة");

        return;

    }

    invoices.push(invoice);

    renderInvoices();

}

// عرض الجدول

function renderInvoices(){

    const table=document.getElementById("invoiceTable");

    table.innerHTML="";

    invoices.forEach((inv,index)=>{

        table.innerHTML += `

        <tr>

        <td>${inv.number}</td>

        <td>${inv.date}</td>

        <td>${inv.supplier}</td>

        <td>${inv.section}</td>

        <td>${inv.currency}</td>

        <td>${inv.amount}</td>

        <td>${inv.due}</td>

        <td>

        <button class="btn btn-sm btn-danger"

        onclick="deleteInvoice(${index})">

        حذف

        </button>

        </td>

        </tr>

        `;

    });

}

// حذف

function deleteInvoice(index){

    invoices.splice(index,1);

    renderInvoices();

}
