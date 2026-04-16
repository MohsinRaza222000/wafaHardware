const admin = require('firebase-admin');

let isReady = false;

// Initialize with service account from Env Var for Vercel compatibility
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("🔥 Firebase Admin initialized with Service Account");
    isReady = true;
  } catch (err) {
    console.error("⚠️ Firebase Initialization Error:", err.message);
  }
} else {
  console.log("ℹ️ No Firebase Service Account found. Notifications will be disabled.");
}

module.exports = { admin, isReady };
