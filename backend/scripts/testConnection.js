require('dotenv').config();
const mongoose = require('mongoose');

console.log('Testing MongoDB Connection...');
console.log('URI:', process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':****@')); // Hide password in logs

mongoose.connect(process.env.MONGODB_URI, { dbName: 'wafaHardware' })
  .then(() => {
    console.log(`✅ SUCCESS: Connected to MongoDB Atlas Cluster`);
    console.log(`📡 ACTIVE DATABASE: ${mongoose.connection.name}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ ERROR: Connection Failed!');
    console.error(err.message);
    process.exit(1);
  });
