const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const Payment = require("../Model/Payment");
const { isWithinISTWindow, sendMail } = require("../utils/helpers");
const plans = { Free:{amount:0, limit:1, unlimited:false}, Bronze:{amount:100, limit:3, unlimited:false}, Silver:{amount:300, limit:5, unlimited:false}, Gold:{amount:1000, limit:999999, unlimited:true} };
router.get("/plans", (req,res)=>res.json(plans));
router.post("/purchase", async (req,res)=>{
  const { userEmail, plan } = req.body;
  if (!plans[plan]) return res.status(400).json({message:"Invalid plan"});
  if (plan !== "Free" && !isWithinISTWindow(10, 11)) return res.status(403).json({message:"Payments are allowed only between 10:00 AM and 11:00 AM IST."});
  const user = await User.findOne({email:userEmail}); if (!user) return res.status(404).json({message:"User not found"});
  user.subscription = { plan, limit:plans[plan].limit, unlimited:plans[plan].unlimited, paidAt:new Date() }; await user.save();
  const invoice = { invoiceNo:`INV-${Date.now()}`, plan, amount:plans[plan].amount, date:new Date() };
  await Payment.create({ userEmail, purpose:"subscription", plan, amount:plans[plan].amount, invoice });
  await sendMail({ to:userEmail, subject:"Subscription Invoice", text:`Invoice ${invoice.invoiceNo}\nPlan: ${plan}\nAmount: ₹${plans[plan].amount}` });
  res.json({message:"Plan activated", invoice, user});
});
module.exports = router;