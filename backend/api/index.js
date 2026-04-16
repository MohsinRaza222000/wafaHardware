require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Models (Updated paths for api/ folder)
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const Cart = require('../models/Cart');

// Services (Updated paths for api/ folder)
const cloudinary = require('../config/cloudinary');
const { admin, isReady } = require('../firebaseAdmin');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// ===============================
// MongoDB Connection
// ===============================
if (!process.env.MONGODB_URI) {
  console.error("❌ MONGODB_URI is missing from environment variables!");
} else {
  mongoose.connect(process.env.MONGODB_URI, {
    dbName: 'wafaHardware',
    serverSelectionTimeoutMS: 5000, // Timeout after 5 seconds instead of hanging
  })
    .then(() => console.log('✅ MongoDB Connected'))
    .catch(err => {
      console.error('❌ MongoDB Error:', err.message);
    });
}

// ===============================
// USERS
// ===============================

// Sync User
app.post('/users/sync', async (req, res) => {
  try {
    const { uid, fullName, email, phone, address, photoURL } = req.body;

    const user = await User.findOneAndUpdate(
      { uid },
      { fullName, email, phone, address, photoURL },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Profile
app.get('/users/profile/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Users
app.get('/users', async (req, res) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ===============================
// PRODUCTS + NOTIFICATION
// ===============================
app.post('/products', async (req, res) => {
  try {
    const productData = { ...req.body };

    // ☁️ Upload Image
    if (productData.image && productData.image.startsWith('data:image')) {
      const upload = await cloudinary.uploader.upload(productData.image, {
        folder: 'wafaHardware',
      });
      productData.image = upload.secure_url;
    }

    const product = new Product(productData);
    await product.save();

    // 🔥 PUSH NOTIFICATION
    try {
      if (isReady) {
        await admin.messaging().send({
          topic: 'allUsers',
          notification: {
            title: `🛒 ${product.title || 'New Product'}`,
            body: `${product.title} is now available!`,
            image: product.image,
          },
          data: {
            productId: product._id.toString(),
            title: product.title || '',
            price: String(product.price || 0),
            image: product.image || '',
          },
        });
        console.log('📢 Notification sent');
      }
    } catch (err) {
      console.log('⚠️ Notification Error:', err.message);
    }

    res.status(201).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Products
app.get('/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Product
app.put('/products/:id', async (req, res) => {
  try {
    const data = { ...req.body };

    if (data.image && data.image.startsWith('data:image')) {
      const upload = await cloudinary.uploader.upload(data.image, {
        folder: 'wafaHardware',
      });
      data.image = upload.secure_url;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, data, { new: true });

    if (!product) return res.status(404).json({ success: false });

    res.status(200).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Delete Product
app.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false });

    res.status(200).json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ===============================
// ORDERS
// ===============================

// Place Order
app.post('/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get User Orders
app.get('/orders/user/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId || userId === 'undefined') {
      return res.status(200).json([]);
    }

    const query = { $or: [{ userId }] };

    if (userId.length === 24 && /^[0-9a-fA-F]+$/.test(userId)) {
      query.$or.push({ _id: new mongoose.Types.ObjectId(userId) });
    }

    const orders = await Order.find(query)
      .populate('items.productId')
      .sort({ createdAt: -1 });

    res.status(200).json(orders);

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ===============================
// CART
// ===============================

// Sync Cart
app.post('/cart/sync', async (req, res) => {
  try {
    const { userId, items } = req.body;

    const formattedItems = (items || []).map(item => ({
      productId: item.id || item.productId || item._id,
      quantity: item.quantity || 1
    }));

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { items: formattedItems, updatedAt: Date.now() },
      { new: true, upsert: true }
    );

    res.status(200).json({ success: true, cart });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Cart
app.get('/cart/:userId', async (req, res) => {
  try {
    const cart = await Cart.findOne({ userId: req.params.userId })
      .populate('items.productId');

    res.status(200).json(cart ? cart.items : []);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ===============================
// ADMIN STATS
// ===============================
app.get('/admin/stats', async (req, res) => {
  try {
    const [userCount, productCount, orderCount, lowStockCount] = await Promise.all([
      User.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Product.countDocuments({ stock: { $lt: 5 } })
    ]);

    res.status(200).json({
      activeUsers: userCount,
      totalProducts: productCount,
      activeOrders: orderCount,
      lowStock: lowStockCount
    });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// ===============================
app.get('/', (req, res) => {
  res.send('Wafa Hardware API is running on Vercel!');
});

// NO app.listen here for Vercel
module.exports = app;
