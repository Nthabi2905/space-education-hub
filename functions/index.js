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

exports.matchSchools = functions.https.onRequest(async (req, res) => {
  try {
    const lat = parseFloat(req.query.lat),
      lng = parseFloat(req.query.lng),
      radiusKm = parseFloat(req.query.radiusKm || 200);
    if (Number.isNaN(lat) || Number.isNaN(lng))
      return res.status(400).send("Provide lat & lng numeric");
    const snap = await db
      .collection("schools")
      .where("isUnderserved", "==", true)
      .get();
    const out = [];
    snap.forEach((d) => {
      const s = d.data();
      if (!s.location) return;
      const dkm = distanceKm(lat, lng, s.location.lat, s.location.lng);
      if (dkm <= radiusKm)
        out.push({ id: d.id, name: s.name, province: s.province, dist: dkm });
    });
    out.sort((a, b) => a.dist - b.dist);
    return res.json({ count: out.length, results: out });
  } catch (e) {
    console.error(e);
    return res.status(500).send("Server error");
  }
});
