require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('./models/Product');
const Order = require('./models/Order');
const User = require('./models/User');

async function checkData() {
  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'wafaHardware' });
    console.log('Connected to MongoDB.');

    const productCount = await Product.countDocuments();
    const orderCount = await Order.countDocuments();
    const userCount = await User.countDocuments();

    console.log('--- Database Stats ---');
    console.log(`Products: ${productCount}`);
    console.log(`Orders: ${orderCount}`);
    console.log(`Users: ${userCount}`);

    if (productCount > 0) {
      console.log('\n--- Sample Products ---');
      const products = await Product.find().limit(2);
      products.forEach(p => console.log(`- ${p.title} (${p.category})`));
    }

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    process.exit(0);
  }
}

checkData();
