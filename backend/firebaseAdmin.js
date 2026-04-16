const admin = require('firebase-admin');

// Initialize with service account from Env Var for Vercel compatibility
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin initialized with Service Account");
  } catch (err) {
    console.error("❌ Firebase Initialization Error:", err.message);
  }
} else {
  // Fallback for local dev
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
  });
}

module.exports = admin;