import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  content: { type: String, required: true },
  sentiment: { type: String, enum: ["Positive", "Neutral", "Negative"], required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true },
  replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CommentReply' }],
}, {
  timestamps: true,
});

const Comment = mongoose.model("Comment", commentSchema);
export default Comment;
