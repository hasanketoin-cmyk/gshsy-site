import { db } from "./firebase.js";

import {
    collection,
    addDoc,
    getDocs,
    deleteDoc,
    doc,
    query,
    orderBy,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

// ==========================
// Collection
// ==========================

const usersRef = collection(db, "users");

// ==========================
// Elements
// ==========================

const userName = document.getElementById("userName");
const userEmail = document.getElementById("userEmail");
const userPassword = document.getElementById("userPassword");
const userRole = document.getElementById("userRole");
const userStatus = document.getElementById("userStatus");

const saveUser = document.getElementById("saveUser");
const usersTable = document.getElementById("usersTable");

const usersCount = document.getElementById("usersCount");
const adminsCount = document.getElementById("adminsCount");
const accountantsCount = document.getElementById("accountantsCount");
const activeUsers = document.getElementById("activeUsers");

// ==========================
// Start
// ==========================

loadUsers();

saveUser.addEventListener("click", addUser);

// ==========================
// Add User
// ==========================

async function addUser() {

    if (userName.value.trim() === "") {
        alert("أدخل الاسم");
        return;
    }

    if (userEmail.value.trim() === "") {
        alert("أدخل البريد الإلكتروني");
        return;
    }

    if (userPassword.value.trim() === "") {
        alert("أدخل كلمة المرور");
        return;
    }

    try {

        await addDoc(usersRef, {

            name: userName.value,

            email: userEmail.value,

            password: userPassword.value,

            role: userRole.value,

            status: userStatus.value === "true",

            createdAt: serverTimestamp()

        });

        alert("تم حفظ المستخدم");

        clearForm();

        loadUsers();

    } catch (error) {

        console.error(error);

        alert(error.message);

    }

}

// ==========================
// Load Users
// ==========================

async function loadUsers() {

    usersTable.innerHTML = "";

    let total = 0;
    let admins = 0;
    let accountants = 0;
    let active = 0;

    const q = query(usersRef, orderBy("name"));

    const snapshot = await getDocs(q);

    snapshot.forEach((docSnap) => {

        const data = docSnap.data();

        total++;

        if (data.role === "admin") admins++;

        if (data.role === "accountant") accountants++;

        if (data.status) active++;

        usersTable.innerHTML += `

        <tr>

            <td>${data.name}</td>

            <td>${data.email}</td>

            <td>${data.role}</td>

            <td>${data.status ? "نشط" : "موقوف"}</td>

            <td>

                <button
                    class="btn btn-danger btn-sm deleteBtn"
                    data-id="${docSnap.id}">

                    حذف

                </button>

            </td>

        </tr>

        `;

    });

    usersCount.textContent = total;
    adminsCount.textContent = admins;
    accountantsCount.textContent = accountants;
    activeUsers.textContent = active;

    document.querySelectorAll(".deleteBtn").forEach(btn => {

        btn.addEventListener("click", () => {

            deleteUser(btn.dataset.id);

        });

    });

}

// ==========================
// Delete User
// ==========================

async function deleteUser(id) {

    if (!confirm("هل تريد حذف المستخدم؟")) return;

    await deleteDoc(doc(db, "users", id));

    loadUsers();

}

// ==========================
// Clear
// ==========================

function clearForm() {

    userName.value = "";
    userEmail.value = "";
    userPassword.value = "";
    userRole.value = "viewer";
    userStatus.value = "true";

}
