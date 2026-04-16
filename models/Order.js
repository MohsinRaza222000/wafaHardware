const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true }, // Firebase UID for user linking
  items: [
    {
      productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
      title:     { type: String },   // Stored for display without needing populate
      image:     { type: String },   // Stored for display without needing populate
      quantity:  { type: Number, required: true },
      price:     { type: Number, required: true },
    }
  ],
  totalAmount:     { type: Number, required: true },
  status:          { type: String, default: 'pending' },
  shippingAddress: { type: String },
  createdAt:       { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
