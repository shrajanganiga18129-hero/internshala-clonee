const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const allowed = ["en","es","hi","pt","zh","fr"];
router.post("/change", async(req,res)=>{
 const { userEmail, language, otpVerified } = req.body;
 if (!allowed.includes(language)) return res.status(400).json({message:"Language not supported"});
 if (language === "fr" && !otpVerified) return res.status(403).json({message:"French language change requires email OTP verification."});
 const user = await User.findOneAndUpdate({email:userEmail}, {preferredLanguage:language}, {new:true});
 if (!user) return res.status(404).json({message:"User not found"});
 res.json({message:"Language changed", user});
});
module.exports = router;