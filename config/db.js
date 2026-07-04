const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

const connectDB = async () => {
  try {
    console.log("Attempting to connect to MongoDB Atlas...");
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Atlas connected");
  } catch (err) {
    console.log("⚠️ Atlas connection failed! Falling back to local in-memory database...");
    
    try {
      const mongoServer = await MongoMemoryServer.create();
      const mongoUri = mongoServer.getUri();
      await mongoose.connect(mongoUri);
      console.log("✅ Local In-Memory MongoDB connected! (Data will be cleared on restart)");
    } catch (fallbackErr) {
      console.log("Full Error:");
      console.error(fallbackErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;