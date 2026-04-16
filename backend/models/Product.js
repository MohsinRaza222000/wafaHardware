const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  oldPrice: { type: Number },
  category: { type: String, required: true },
  image: { type: String }, // Base64 or URL
  sku: { type: String, unique: true },
  stock: { type: Number, default: 0 },
  badge: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);
