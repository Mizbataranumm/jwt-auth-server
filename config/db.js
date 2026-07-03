const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    console.log("Connecting to:");
    console.log(process.env.MONGODB_URI);

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("✅ MongoDB connected");
  } catch (err) {
    console.log("Full Error:");
    console.dir(err, { depth: null });
    process.exit(1);
  }
};

module.exports = connectDB;