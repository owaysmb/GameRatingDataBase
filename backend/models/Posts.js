import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
  forumId: { type: String, required: true },
  userId:    { type: mongoose.Schema.Types.ObjectId, ref: 'User',  required: true },
  type:      { type: String, enum: ['text', 'media', 'link'], required: true },
  title:     { type: String },
  text:      { type: String },
  mediaUrl:  { type: String },
  linkUrl:   { type: String },
  likes:     { type: Number, default: 0 },
  disLikes:  { type: Number, default: 0 },
}, { timestamps: true })

PostSchema.index({ forumId: 1, createdAt: -1 })

export default mongoose.model('Post', PostSchema)