require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../models/Admin');

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const email = (process.env.ADMIN_EMAIL || 'admin@hayatoolings.com').toLowerCase();
    const password = process.env.ADMIN_PASSWORD || 'Admin@12345';
    const name = process.env.ADMIN_NAME || 'Haya Admin';

    let admin = await Admin.findOne({ email });
    const passwordHash = await Admin.hashPassword(password);
    if (admin) {
      admin.passwordHash = passwordHash;
      admin.name = name;
      await admin.save();
      console.log(`[seed] Updated admin: ${email}`);
    } else {
      admin = await Admin.create({ email, passwordHash, name, role: 'admin' });
      console.log(`[seed] Created admin: ${email}`);
    }
    console.log(`[seed] Login with email: ${email}  password: ${password}`);
  } catch (err) {
    console.error('[seed] Failed:', err.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
})();
