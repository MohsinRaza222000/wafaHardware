require('dotenv').config();
const mongoose = require('mongoose');

async function cleanDatabases() {
  try {
    // 1. Connect to whatever the current URI points to
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to:', mongoose.connection.name);

    if (mongoose.connection.name === 'test') {
      console.log('⚠️ WARNING: Still connected to "test" database!');
      console.log('Dropping "test" database now...');
      await mongoose.connection.db.dropDatabase();
      console.log('✅ "test" database dropped.');
    } else {
      console.log('✅ Currently connected to:', mongoose.connection.name);
    }

    await mongoose.disconnect();

    // 2. Try to connect explicitly to wafaHardware and create a dummy record
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'wafaHardware' });
    console.log('Re-connected explicitly to:', mongoose.connection.name);
    
    // Create a dummy collection to force creation if it doesn't exist
    const Dummy = mongoose.model('Dummy', new mongoose.Schema({ name: String }), 'connection_test_sync');
    await Dummy.create({ name: 'Force Creation ' + new Date().toISOString() });
    console.log('✅ Dummy record created in wafaHardware database.');
    
    await mongoose.disconnect();
    console.log('Done.');
  } catch (err) {
    console.error('Error during database cleaning:', err.message);
  } finally {
    process.exit(0);
  }
}

cleanDatabases();
