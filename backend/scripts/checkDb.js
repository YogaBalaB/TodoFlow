const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/todoflow';
const opts = { serverSelectionTimeoutMS: 5000 };

(async () => {
  try {
    const conn = await mongoose.connect(uri, opts);
    console.log('Connected to MongoDB:', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err && err.message ? err.message : err);
    process.exit(1);
  }
})();
