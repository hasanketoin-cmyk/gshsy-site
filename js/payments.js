// =======================
// عناصر بيانات الفاتورة
// =======================

const paymentSupplier = document.getElementById("paymentSupplier");
const invoiceAmount = document.getElementById("invoiceAmount");
const paidAmount = document.getElementById("paidAmount");
const remainingAmount = document.getElementById("remainingAmount");

// =======================
// تحميل بيانات الفاتورة
// =======================

async function loadInvoiceData() {

    if (invoiceSelect.value === "") {

        paymentSupplier.value = "";
        invoiceAmount.value = "";
        paidAmount.value = "";
        remainingAmount.value = "";

        return;
    }

    try {

        const invoiceRef = doc(db, "invoices", invoiceSelect.value);

        const invoiceSnap = await getDoc(invoiceRef);

        if (!invoiceSnap.exists()) return;

        const data = invoiceSnap.data();

        paymentSupplier.value = data.supplier || "";

        invoiceAmount.value = data.amount || 0;

        paidAmount.value = data.paid || 0;

        remainingAmount.value = data.remaining ?? data.amount;

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}
