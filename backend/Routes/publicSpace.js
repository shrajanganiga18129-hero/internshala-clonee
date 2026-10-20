const express = require("express");
const router = express.Router();
const Post = require("../Model/Post");
const User = require("../Model/User");
const { startOfToday } = require("../utils/helpers");

router.get("/", async (req,res)=> res.json(await Post.find().sort({createdAt:-1})) );
router.post("/", async (req,res)=>{
  const { userEmail, user, caption, mediaUrl, mediaType } = req.body;
  const dbUser = await User.findOne({ email:userEmail || user?.email });
  if (!dbUser) return res.status(404).json({ message:"User not found. Login/sync user first." });
  const friendCount = dbUser.friends.length;
  if (friendCount === 0) return res.status(403).json({ message:"Users with no friends cannot post." });
  let dailyLimit = friendCount > 10 ? Infinity : friendCount;
  const todayPosts = await Post.countDocuments({ "user.email": dbUser.email, createdAt:{ $gte:startOfToday() } });
  if (todayPosts >= dailyLimit) return res.status(403).json({ message:`Posting limit reached. You can post ${dailyLimit} time(s) per day based on your friends.` });
  const post = await Post.create({ user:{ name:dbUser.name, email:dbUser.email, photo:dbUser.photo }, caption, mediaUrl, mediaType });
  res.json(post);
});
router.post("/:id/like", async (req,res)=>{
  const { userEmail } = req.body; const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({message:"Post not found"});
  const i = post.likes.indexOf(userEmail); if (i>=0) post.likes.splice(i,1); else post.likes.push(userEmail);
  await post.save(); res.json(post);
});
router.post("/:id/comment", async (req,res)=>{
  const post = await Post.findById(req.params.id); if (!post) return res.status(404).json({message:"Post not found"});
  post.comments.push({ user:req.body.user, text:req.body.text }); await post.save(); res.json(post);
});
router.post("/:id/share", async (req,res)=>{
  const post = await Post.findByIdAndUpdate(req.params.id, { $inc:{shares:1} }, {new:true}); res.json(post);
});
module.exports = router;