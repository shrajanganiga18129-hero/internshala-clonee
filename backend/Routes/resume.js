const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const Payment = require("../Model/Payment");
router.post("/save", async(req,res)=>{
  const { userEmail, resume, otpVerified, paymentDone } = req.body;
  const user = await User.findOne({email:userEmail}); if (!user) return res.status(404).json({message:"User not found"});
  if (!["Bronze","Silver","Gold"].includes(user.subscription.plan)) return res.status(403).json({message:"Resume creation is available only under premium plan."});
  if (!otpVerified) return res.status(403).json({message:"Please verify OTP before payment."});
  if (!paymentDone) return res.status(402).json({message:"₹50 resume payment required."});
  user.resume = { ...resume, generatedAt:new Date() }; await user.save();
  await Payment.create({ userEmail, purpose:"resume", amount:50, status:"success", invoice:{invoiceNo:`RES-${Date.now()}`, amount:50} });
  res.json({message:"Resume generated and attached to profile", resume:user.resume});
});
module.exports = router;