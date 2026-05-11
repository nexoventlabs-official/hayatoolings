const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema(
  {
    type: { type: String, enum: ['quote', 'contact'], required: true, index: true },
    name: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, trim: true },
    country: { type: String },
    subject: { type: String },
    message: { type: String, required: true },
    status: { type: String, enum: ['new', 'in_progress', 'resolved'], default: 'new', index: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Enquiry', EnquirySchema);
