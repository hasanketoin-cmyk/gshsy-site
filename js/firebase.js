import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDlJSaBseec_hXDIehu478AI5H8co1Y-jk",
  authDomain: "erp24-f8379.firebaseapp.com",
  projectId: "erp24-f8379",
  storageBucket: "erp24-f8379.firebasestorage.app",
  messagingSenderId: "266476764859",
  appId: "1:266476764859:web:01f2c30e614cf08d17739e",
  measurementId: "G-MYZLLVBQF0"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
