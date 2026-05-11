const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema(
  {
    productId: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String },
    price: { type: Number, required: true }, // unit price in INR (base)
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const ShippingSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
    countryCode: { type: String, required: true }, // ISO-2
    notes: { type: String },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true, unique: true, index: true },
    items: { type: [OrderItemSchema], required: true, validate: v => v.length > 0 },
    subtotalInr: { type: Number, required: true },
    totalInr: { type: Number, required: true },
    currency: { type: String, enum: ['INR', 'USD', 'EUR'], default: 'INR' },
    exchangeRate: { type: Number, default: 1 }, // 1 INR -> X selected currency
    totalDisplay: { type: Number, required: true }, // total in selected currency
    shipping: { type: ShippingSchema, required: true },
    paymentMethod: { type: String, enum: ['payglocal', 'cod', 'upi', 'card'], required: true },
    paymentStatus: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
      index: true,
    },
    orderStatus: {
      type: String,
      enum: ['placed', 'confirmed', 'shipped', 'delivered', 'cancelled'],
      default: 'placed',
      index: true,
    },
    transactionRef: { type: String }, // PayGlocal GID / our internal txn id
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
