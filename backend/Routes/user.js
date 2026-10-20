const express = require("express");
const router = express.Router();
const User = require("../Model/User");
const Otp = require("../Model/Otp");
const { generateLetterPassword, generateOtp, sendMail, parseLoginEnvironment, isWithinISTWindow } = require("../utils/helpers");

async function findOrCreateUser({ email, phone, name, photo }) {
  let user = await User.findOne(email ? { email } : { phone });
  if (!user) user = await User.create({ email, phone, name: name || email || phone, photo, password: generateLetterPassword(8) });
  return user;
}

router.post("/sync", async (req, res) => {
  const user = await findOrCreateUser(req.body);
  res.json(user);
});

router.post("/forgot-password", async (req, res) => {
  const { email, phone } = req.body;
  const user = await User.findOne(email ? { email } : { phone });
  if (!user) return res.status(404).json({ message: "User not found" });
  const today = new Date(); today.setHours(0,0,0,0);
  if (user.lastForgotPasswordAt && user.lastForgotPasswordAt >= today) return res.status(429).json({ message: "You can use this option only once per day." });
  const newPassword = generateLetterPassword(10);
  user.password = newPassword;
  user.lastForgotPasswordAt = new Date();
  await user.save();
  await sendMail({ to: user.email || phone, subject: "Password Reset", text: `Your new generated password is: ${newPassword}` });
  res.json({ message: "Password reset successful. Check email/console for new password.", generatedPassword: newPassword });
});

router.post("/request-otp", async (req, res) => {
  const { email, phone, purpose } = req.body;
  const otp = generateOtp();
  await Otp.create({ email, phone, purpose, otp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) });
  await sendMail({ to: email || phone, subject: `OTP for ${purpose}`, text: `Your OTP is ${otp}` });
  res.json({ message: "OTP sent. For demo, OTP is also returned.", otp });
});

router.post("/verify-otp", async (req, res) => {
  const { email, phone, purpose, otp } = req.body;
  const record = await Otp.findOne({ ...(email ? { email } : { phone }), purpose, otp, used:false }).sort({ createdAt:-1 });
  if (!record || record.expiresAt < new Date()) return res.status(400).json({ message: "Invalid or expired OTP" });
  record.used = true; await record.save();
  res.json({ message: "OTP verified" });
});

router.post("/login-check", async (req, res) => {
  const { email, name, photo, otp } = req.body;
  const env = parseLoginEnvironment(req);
  const user = await findOrCreateUser({ email, name, photo });
  let status = "success", reason = "Login allowed";
  if (env.deviceType === "mobile" && !isWithinISTWindow(10, 13)) { status = "blocked"; reason = "Mobile login allowed only between 10:00 AM and 1:00 PM IST"; }
  if (status === "success" && env.browser === "Google Chrome") {
    if (!otp) {
      const code = generateOtp();
      await Otp.create({ email, purpose:"chrome-login", otp:code, expiresAt:new Date(Date.now()+10*60*1000) });
      await sendMail({ to: email, subject:"Chrome Login OTP", text:`Your OTP is ${code}` });
      status="otp_required"; reason="Google Chrome login requires OTP verification";
    } else {
      const record = await Otp.findOne({ email, purpose:"chrome-login", otp, used:false }).sort({ createdAt:-1 });
      if (!record || record.expiresAt < new Date()) { status="blocked"; reason="Invalid Chrome OTP"; }
      else { record.used=true; await record.save(); }
    }
  }
  user.loginHistory.push({ ...env, status, reason });
  await user.save();
  if (status === "blocked") return res.status(403).json({ message: reason, env });
  if (status === "otp_required") return res.status(202).json({ message: reason, env });
  res.json({ message: reason, user, env });
});

router.get("/profile/:email", async (req, res) => {
  const user = await User.findOne({ email: req.params.email });
  if (!user) return res.status(404).json({ message:"User not found" });
  res.json(user);
});

router.post("/friends", async (req,res)=>{
  const { userEmail, friendEmail } = req.body;
  const user = await findOrCreateUser({ email:userEmail });
  const friend = await findOrCreateUser({ email:friendEmail });
  if (!user.friends.map(String).includes(String(friend._id))) user.friends.push(friend._id);
  await user.save();
  res.json({ message:"Friend added", friendCount:user.friends.length, user });
});
module.exports = router;