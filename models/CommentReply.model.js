import mongoose from 'mongoose';

/**
 * CommentReply Schema
 * @typedef {Object} CommentReply
 * @property {String} content - The reply text
 * @property {mongoose.Types.ObjectId} user - Reference to User
 * @property {mongoose.Types.ObjectId} comment - Reference to Comment
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
const commentReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: true },
}, {
  timestamps: true,
});

const CommentReply = mongoose.model("CommentReply", commentReplySchema);
export default CommentReply;
