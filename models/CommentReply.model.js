import mongoose from 'mongoose';

const commentReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
}, {
  timestamps: true,
});

const CommentReply = mongoose.model("CommentReply", commentReplySchema);
export default CommentReply;
