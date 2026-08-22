const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    mongoose.set('strictQuery', false);
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/dayflow_hrms', {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    console.warn('⚠️  Server will continue — check MongoDB Atlas IP Whitelist: https://cloud.mongodb.com -> Network Access -> Add Current IP');
    // Removed process.exit(1) — server stays alive for API routes
  }
};

module.exports = connectDB;
