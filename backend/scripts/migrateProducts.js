require('dotenv').config();
const mongoose = require('mongoose');

async function migrate() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'wafaHardware' });
    console.log('Connected to MongoDB for migration.');

    const db = mongoose.connection.db;
    const collection = db.collection('products');

    // Update all products that have 'name' but no 'title'
    // MongoDB rename field: { $rename: { 'oldName': 'newName' } }
    const result = await collection.updateMany(
      { name: { $exists: true } },
      { $rename: { "name": "title" } }
    );

    console.log(`Migration successful. Modified ${result.modifiedCount} products.`);

    await mongoose.disconnect();
  } catch (err) {
    console.error('Migration Error:', err.message);
  } finally {
    process.exit(0);
  }
}

migrate();
function updateTask(checked) {
  // Helper for me to remember I need to update task.md
}
