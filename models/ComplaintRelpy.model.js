import mongoose from 'mongoose';

/**
 * ComplaintReply Schema
 * @typedef {Object} ComplaintReply
 * @property {String} content - The reply text
 * @property {mongoose.Types.ObjectId} userId - Reference to User
 * @property {mongoose.Types.ObjectId} complaintId - Reference to UserComplaint
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
const complaintReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserComplaint', required: true }
}, {
  timestamps: true
});

const ComplaintReply = mongoose.model('ComplaintReply', complaintReplySchema);
export default ComplaintReply;