import mongoose from 'mongoose';

const complaintReplySchema = new mongoose.Schema({
  content: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserComplaint', required: true }
}, {
  timestamps: true
});

const ComplaintReply = mongoose.model('ComplaintReply', complaintReplySchema);
export default ComplaintReply;