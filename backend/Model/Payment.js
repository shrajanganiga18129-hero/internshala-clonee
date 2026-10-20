const mongoose = require("mongoose");
const PaymentSchema = new mongoose.Schema({ userEmail:String, purpose:String, plan:String, amount:Number, status:{type:String, default:"success"}, invoice:Object }, { timestamps:true });
module.exports = mongoose.model("Payment", PaymentSchema);