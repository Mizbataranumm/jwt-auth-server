const mongoose = require("mongoose");

const uri =
"mongodb+srv://mizbataranum309:MiZba%40@mizba.dxxss.mongodb.net/auth-db?retryWrites=true&w=majority&appName=Mizba";

async function test() {
  try {
    console.log("Connecting...");
    await mongoose.connect(uri);
    console.log("✅ Connected!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

test();