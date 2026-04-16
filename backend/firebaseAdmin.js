const admin = require('firebase-admin');

// Initialize without service account file
admin.initializeApp({
  credential: admin.credential.applicationDefault(),
});

module.exports = admin;