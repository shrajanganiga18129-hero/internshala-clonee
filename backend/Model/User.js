const mongoose = require("mongoose");
const LoginHistorySchema = new mongoose.Schema({ browser:String, os:String, deviceType:String, ip:String, status:String, reason:String, createdAt:{type:Date, default:Date.now} });
const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true, sparse: true },
  phone: String,
  photo: String,
  password: String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  subscription: { plan: { type: String, default: "Free" }, limit: { type: Number, default: 1 }, unlimited: { type: Boolean, default: false }, paidAt: Date },
  preferredLanguage: { type: String, default: "en" },
  resume: Object,
  lastForgotPasswordAt: Date,
  loginHistory: [LoginHistorySchema]
}, { timestamps: true });
module.exports = mongoose.model("User", UserSchema);