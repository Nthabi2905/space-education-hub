import dotenv from "dotenv";
dotenv.config();

// ---------- uploadSchools.js ----------
// 1️⃣  Add your own Firebase config values below
//     (from Firebase Console → Project Settings → Your apps → SDK setup and configuration)
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
};

// 2️⃣  Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 3️⃣  Demo dataset — 10 South African schools
const schools = [
  {
    name: "Lukhanyo Primary School",
    province: "Western Cape",
    isUnderserved: true,
    location: { lat: -34.4234, lng: 19.2412 },
  },
  {
    name: "Somerset West Primary",
    province: "Western Cape",
    isUnderserved: false,
    location: { lat: -34.0833, lng: 18.85 },
  },
  {
    name: "Molapo Secondary School",
    province: "Gauteng",
    isUnderserved: true,
    location: { lat: -26.2667, lng: 27.9333 },
  },
  {
    name: "Mamelodi East Secondary School",
    province: "Gauteng",
    isUnderserved: true,
    location: { lat: -25.7291, lng: 28.3778 },
  },
  {
    name: "Tembisa High School",
    province: "Gauteng",
    isUnderserved: true,
    location: { lat: -25.975, lng: 28.2167 },
  },
  {
    name: "Ikamva High School",
    province: "Eastern Cape",
    isUnderserved: true,
    location: { lat: -32.97, lng: 27.87 },
  },
  {
    name: "Durban North College",
    province: "KwaZulu-Natal",
    isUnderserved: false,
    location: { lat: -29.7833, lng: 31.0333 },
  },
  {
    name: "Ulundi Secondary School",
    province: "KwaZulu-Natal",
    isUnderserved: true,
    location: { lat: -28.3333, lng: 31.4167 },
  },
  {
    name: "Polokwane Technical High School",
    province: "Limpopo",
    isUnderserved: false,
    location: { lat: -23.9, lng: 29.45 },
  },
  {
    name: "Thohoyandou Community School",
    province: "Limpopo",
    isUnderserved: true,
    location: { lat: -22.95, lng: 30.4667 },
  },
];

// 4️⃣  Upload them to Firestore
(async () => {
  try {
    for (const school of schools) {
      const docRef = await addDoc(collection(db, "schools"), school);
      console.log("✅ Added:", school.name, "→ ID:", docRef.id);
    }
    console.log("🎉 All schools uploaded successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Upload failed:", error);
    process.exit(1);
  }
})();
