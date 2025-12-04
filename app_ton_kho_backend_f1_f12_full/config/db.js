const mongoose = require("mongoose");

async function connectDB() {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    console.error("❌ MONGO_URI chưa được cấu hình trong .env");
    process.exit(1);
  }
  try {
    await mongoose.connect(uri, {
      // Các option mới không cần useNewUrlParser/useUnifiedTopology nữa trong Mongoose 8
    });
    console.log("✅ MongoDB connected:", uri);
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

module.exports = connectDB;
