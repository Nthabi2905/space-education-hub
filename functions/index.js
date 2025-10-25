// functions/index.js
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();
const db = admin.firestore();

function distanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = Math.PI / 180;
  const dLat = (lat2 - lat1) * toRad;
  const dLon = (lon2 - lon1) * toRad;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * toRad) * Math.cos(lat2 * toRad) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

// HTTP function: match nearby underserved schools
exports.matchSchools = functions.https.onRequest(async (req, res) => {
  try {
    const { lat, lng, radiusKm = 100 } = req.query;
    if (!lat || !lng) return res.status(400).send("Provide lat & lng");
    const snap = await db
      .collection("schools")
      .where("isUnderserved", "==", true)
      .get();
    const results = [];
    snap.forEach((d) => {
      const s = d.data();
      const id = d.id;
      if (!s.location) return;
      const dkm = distanceKm(
        parseFloat(lat),
        parseFloat(lng),
        s.location.lat,
        s.location.lng
      );
      if (dkm <= parseFloat(radiusKm))
        results.push({ id, name: s.name, province: s.province, dist: dkm });
    });
    results.sort((a, b) => a.dist - b.dist);
    return res.json({ count: results.length, results });
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});
