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
const fetch = require('node-fetch'); // Moved to top

const app = express();

// ===============================
// SERVERLESS MONGOOSE CONNECTION (CACHED)
// ===============================
let cachedConnection = global.mongoose;

if (!cachedConnection) {
  cachedConnection = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cachedConnection.conn) return cachedConnection.conn;

  if (!cachedConnection.promise) {
    const opts = {
      dbName: 'wafaHardware',
      bufferCommands: false, // FAIL FAST if not connected
      serverSelectionTimeoutMS: 5000,
      maxPoolSize: 5, // Best for serverless
    };

    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from environment variables!");
    }

    cachedConnection.promise = mongoose.connect(process.env.MONGODB_URI, opts).then((m) => {
      console.log('✅ MongoDB Connected (New Connection)');
      return m;
    });
  }

  try {
    cachedConnection.conn = await cachedConnection.promise;
  } catch (e) {
    cachedConnection.promise = null;
    throw e;
  }

  return cachedConnection.conn;
}

// ===============================
// Middleware
// ===============================
app.use(cors());
app.use(express.json({ limit: '50mb' }));

// Database Guard Middleware: Runs on every request starting with /api
app.use('/api', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    res.status(500).json({ 
      success: false, 
      message: "Database Connection Failure", 
      error: err.message 
    });
  }
});

// ===============================
// USERS
// ===============================

// Sync User
app.post('/api/users/sync', async (req, res) => {
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
app.get('/api/users/profile/:uid', async (req, res) => {
  try {
    const user = await User.findOne({ uid: req.params.uid });
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.status(200).json({ success: true, user });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get All Users
app.get('/api/users', async (req, res) => {
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
app.post('/api/products', async (req, res) => {
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

    // 🔥 PUSH NOTIFICATION (via Bridge)
    try {
      console.log("DEBUG: Starting Notification Bridge check...");
      const bridgeUrl = process.env.NOTIFICATION_BRIDGE_URL;
      
      if (bridgeUrl) {
        console.log(`DEBUG: Calling Bridge: ${bridgeUrl.substring(0, 30)}...`);
        const response = await fetch(bridgeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            secret: "WAFA_HARDWARE_SECRET_123",
            topic: "allUsers",
            title: `🛒 ${product.title || 'New Product'}`,
            body: `${product.title} is now available!`,
            image: product.image,
            data: {
              productId: product._id.toString(),
              title: product.title || '',
              price: String(product.price || 0),
              image: product.image || '',
            }
          })
        });

        const result = await response.text();
        console.log(`📢 Bridge Status: ${response.status}`);
        console.log(`📢 Bridge Response: ${result}`);
      } else {
        console.log('ℹ️ No Notification Bridge URL found in Environment Variables.');
      }
    } catch (err) {
      console.log('⚠️ Notification Bridge Critical Error:', err.message);
    }

    res.status(201).json({ success: true, product });

  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get Products
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Update Product
app.put('/api/products/:id', async (req, res) => {
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
app.delete('/api/products/:id', async (req, res) => {
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
app.post('/api/orders', async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.status(201).json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Get User Orders
app.get('/api/orders/user/:userId', async (req, res) => {
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
app.post('/api/cart/sync', async (req, res) => {
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
app.get('/api/cart/:userId', async (req, res) => {
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
app.get('/api/admin/stats', async (req, res) => {
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
// DIAGNOSTICS (SMART)
// ===============================
app.get('/api/db-status', async (req, res) => {
  const states = ['Disconnected', 'Connected', 'Connecting', 'Disconnecting'];
  const state = mongoose.connection.readyState;
  
  // Mask the URI for security
  const uri = process.env.MONGODB_URI || "MISSING";
  const maskedUri = uri.replace(/\/\/.*:.*@/, "//USER:PASSWORD@");

  try {
    await connectDB();
    const count = await Product.countDocuments();
    res.status(200).json({ 
      success: true, 
      message: 'Database Connected Successfully!', 
      connectionState: states[state],
      productCount: count,
      uriDetected: uri !== "MISSING",
      uriMasked: maskedUri
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Database Connection Error', 
      connectionState: states[state],
      uriDetected: uri !== "MISSING",
      uriMasked: maskedUri,
      error: error.message,
      tip: "If the error is 'bad auth', check your password in Vercel. If it is 'timeout', check your IP Whitelist in MongoDB Atlas."
    });
  }
});

app.get('/', (req, res) => {
  res.send('Wafa Hardware API is running on Vercel!');
});

module.exports = app;
