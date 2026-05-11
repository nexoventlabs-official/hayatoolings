const mongoose = require('mongoose');

const TransactionSchema = new mongoose.Schema(
  {
    txnId: { type: String, required: true, unique: true, index: true }, // our internal id
    orderId: { type: String, index: true }, // links to Order.orderId
    gateway: { type: String, default: 'payglocal' },
    gatewayRef: { type: String, index: true }, // PayGlocal GID / payment id
    paymentButtonId: { type: String }, // pb_xxx (simple-pay button id)
    amount: { type: Number, required: true },
    currency: { type: String, required: true, enum: ['INR', 'USD', 'EUR'] },
    status: {
      type: String,
      enum: ['pending', 'success', 'failed', 'refunded', 'cancelled'],
      default: 'pending',
      index: true,
    },
    customerEmail: { type: String },
    customerName: { type: String },
    customerCountry: { type: String },
    rawRequest: { type: mongoose.Schema.Types.Mixed },
    rawResponse: { type: mongoose.Schema.Types.Mixed }, // webhook / return payload
    failureReason: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Transaction', TransactionSchema);
