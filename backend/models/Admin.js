const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AdminSchema = new mongoose.Schema(
  {
    name: { type: String, default: 'Admin' },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'staff'], default: 'admin' },
  },
  { timestamps: true }
);

AdminSchema.methods.verifyPassword = function (plain) {
  return bcrypt.compare(plain, this.passwordHash);
};

AdminSchema.statics.hashPassword = function (plain) {
  return bcrypt.hash(plain, 10);
};

module.exports = mongoose.model('Admin', AdminSchema);
