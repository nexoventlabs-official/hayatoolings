const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error('[db] MONGO_URI is not set in .env');
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 8000,
    });
    console.log(`[db] MongoDB connected: ${mongoose.connection.host}/${mongoose.connection.name}`);
  } catch (err) {
    console.error('[db] MongoDB connection error:', err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
