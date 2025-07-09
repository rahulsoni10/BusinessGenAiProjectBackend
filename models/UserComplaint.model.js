import mongoose from 'mongoose';

/**
 * UserComplaint Schema
 * @typedef {Object} UserComplaint
 * @property {String} orderId - Order identifier
 * @property {String} productType - Type of product
 * @property {String} description - Complaint description
 * @property {mongoose.Types.ObjectId} userId - Reference to User
 * @property {String} severity - Severity level (Moderate, High, Urgent)
 * @property {String} status - Complaint status (open, resolved)
 * @property {Array<mongoose.Types.ObjectId>} replies - References to ComplaintReply
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
const userComplaintSchema = new mongoose.Schema({
    orderId: { type: String, required: true, trim: true },
    productType: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    severity: {type: String,enum: ['Moderate', 'High', 'Urgent'],default: 'Moderate'},
    status: {type: String,enum: ['open', 'resolved'],default: 'open'},
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ComplaintReply' }],
    createdAt: { type: Date, default: Date.now }
});

const UserComplaint = mongoose.model('UserComplaint', userComplaintSchema);
export default UserComplaint;
