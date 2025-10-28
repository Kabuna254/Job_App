const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Validate connection string
    if (!process.env.MONGO_URI) {
      throw new Error('MONGO_URI environment variable not set');
    }

    // Remove deprecated options and simplify connection
    const conn = await mongoose.connect(process.env.MONGO_URI);

    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log(`Using Database: ${conn.connection.db.databaseName}`);
    
    return conn;
  } catch (error) {
    console.error('MongoDB Connection Error:', error.message);    
    process.exit(1);
  }
};

module.exports = connectDB;