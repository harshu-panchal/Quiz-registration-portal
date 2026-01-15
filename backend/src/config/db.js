const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        console.log('🔌 Attempting MongoDB connection...');
        console.log('📍 MongoDB URI starts with:', process.env.MONGODB_URI?.substring(0, 30) + '...');

        const conn = await mongoose.connect(process.env.MONGODB_URI, {
            serverSelectionTimeoutMS: 10000, // 10 second timeout
            socketTimeoutMS: 45000,
        });

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
        return conn;
    } catch (error) {
        console.error(`❌ MongoDB Connection Error: ${error.message}`);
        // Don't exit - throw the error so server.js can handle it
        throw error;
    }
};

module.exports = connectDB;

