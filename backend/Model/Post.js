const mongoose = require("mongoose");
const CommentSchema = new mongoose.Schema({ user:Object, text:String, createdAt:{type:Date, default:Date.now} });
const PostSchema = new mongoose.Schema({ user:Object, caption:String, mediaUrl:String, mediaType:{type:String, enum:["photo","video"], default:"photo"}, likes:[String], comments:[CommentSchema], shares:{type:Number, default:0} }, { timestamps: true });
module.exports = mongoose.model("Post", PostSchema);