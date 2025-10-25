// seed/seed.js
const admin = require("firebase-admin");
// Provide path to your service account JSON
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
const db = admin.firestore();

async function seed() {
  console.log("Seeding...");
  // Create schools
  const schools = [
    {
      name: "Lukhanyo Primary",
      province: "Western Cape",
      isUnderserved: true,
      location: { lat: -34.019, lng: 18.778 },
    },
    {
      name: "Mabandla High",
      province: "Eastern Cape",
      isUnderserved: true,
      location: { lat: -32.889, lng: 27.937 },
    },
    {
      name: "Tshepo Secondary",
      province: "Gauteng",
      isUnderserved: false,
      location: { lat: -26.204, lng: 28.047 },
    },
    // add up to 20...
  ];
  for (const s of schools) {
    const ref = await db.collection("schools").add(s);
    console.log("Created school", s.name, ref.id);
  }
  // Create demo org user in 'users' collection (you will create auth via Firebase console or script)
  const orgUser = {
    email: "org1@demo.test",
    role: "organisation",
    profile: { name: "Demo Org" },
  };
  const orgRef = await db.collection("users").add(orgUser);
  console.log("Created demo org user", orgRef.id);

  // Create admin user doc
  const adminUser = {
    email: "admin@demo.test",
    role: "admin",
    profile: { name: "Demo Admin" },
  };
  await db.collection("users").add(adminUser);
  console.log("Admin user created");

  console.log("Seeding complete");
  process.exit(0);
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
