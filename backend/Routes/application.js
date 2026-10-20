const express = require("express");
const router = express.Router();
const application = require("../Model/Application");
const User = require("../Model/User");
const { startOfMonth } = require("../utils/helpers");

router.post("/", async (req, res) => {
  try {
    const userEmail = req.body.user?.email || req.body.userEmail;
    if (userEmail) {
      const dbUser = await User.findOne({ email:userEmail });
      if (dbUser) {
        const used = await application.countDocuments({ "user.email":userEmail, createdAt:{ $gte:startOfMonth() } });
        const sub = dbUser.subscription || { plan:"Free", limit:1, unlimited:false };
        if (!sub.unlimited && used >= sub.limit) return res.status(403).json({ message:`${sub.plan} plan limit reached. You can apply for ${sub.limit} internship(s) per month.` });
      }
    }
    const applicationipdata = new application({ company:req.body.company, category:req.body.category, coverLetter:req.body.coverLetter, user:req.body.user, Application:req.body.Application, body:req.body.body });
    const data = await applicationipdata.save();
    res.send(data);
  } catch(error) { console.log(error); res.status(500).json({ error:"internal server error" }); }
});
router.get("/", async (req, res) => { try { const data = await application.find(); res.status(200).json(data); } catch (error) { res.status(404).json({ error: "internal server error" }); } });
router.get("/:id", async (req, res) => { try { const data = await application.findById(req.params.id); if (!data) return res.status(404).json({ error: "application not found" }); res.status(200).json(data); } catch (error) { res.status(404).json({ error: "internal server error" }); } });
router.put("/:id", async (req, res) => {
  const { action } = req.body; let status;
  if (action === "accepted") status = "accepted"; else if (action === "rejected") status = "rejected"; else return res.status(404).json({ error: "Invalid action" });
  try { const updateapplication = await application.findByIdAndUpdate(req.params.id, { $set:{ status } }, { new:true }); if (!updateapplication) return res.status(404).json({ error:"Not able to update the application" }); res.status(200).json({ sucess:true, data:updateapplication }); } catch (error) { res.status(500).json({ error:"internal server error" }); }
});
module.exports = router;