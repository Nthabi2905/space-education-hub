// --- app.js ---
// Connect frontend to Firebase (Realtime data access)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAW7XnEWpL-j2LKKh4y1YJgVCtlSObGm5o",
  authDomain: "space-education-hub.firebaseapp.com",
  projectId: "space-education-hub",
  storageBucket: "space-education-hub.firebasestorage.app",
  messagingSenderId: "1026522237164",
  appId: "1:1026522237164:web:2147f479e77b849956fdc9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Fetch schools dynamically and show them in your web app
async function loadSchools() {
  const schoolsCol = collection(db, "schools");
  const snapshot = await getDocs(schoolsCol);
  const list = snapshot.docs.map((doc) => doc.data());

  const container = document.getElementById("schools-list");
  container.innerHTML = "";

  list.forEach((school) => {
    const div = document.createElement("div");
    div.className = "school-card";
    div.innerHTML = `
      <h3>${school.name}</h3>
      <p>${school.province}</p>
      <p>${school.isUnderserved ? "🌍 Underserved" : "🏫 Standard"}</p>
    `;
    container.appendChild(div);
  });
}

loadSchools();
