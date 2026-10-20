const mongoose = require("mongoose");
const OtpSchema = new mongoose.Schema({ email:String, phone:String, purpose:String, otp:String, expiresAt:Date, used:{type:Boolean, default:false} }, { timestamps: true });
module.exports = mongoose.model("Otp", OtpSchema);