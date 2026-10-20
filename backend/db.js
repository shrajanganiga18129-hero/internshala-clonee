const mongoose = require("mongoose");
require("dotenv").config();

module.exports.connect = async () => {
  try {
    const url = process.env.DATABASE_URL || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/internshala_clone";
    await mongoose.connect(url);
    console.log("Database is connected");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};
