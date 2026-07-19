import mongoose from "mongoose";

const PostCommentSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  forumId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true },
  likes: [{ type: String }],
  disLikes: [{ type: String }],
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PostComment' }],
}, { timestamps: true });

PostCommentSchema.index({ postId: 1, createdAt: -1 });

export default mongoose.model('PostComment', PostCommentSchema);