import mongoose from 'mongoose';

const userComplaintSchema = new mongoose.Schema({
    orderId: { type: String, required: true, trim: true },
    productType: {type: String,required: true,trim: true},
    description: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    severity: {type: String,enum: ['Moderate', 'High', 'Urgent'],default: 'Moderate'},
    status: {type: String,enum: ['open', 'in_progress', 'resolved'],default: 'open'},
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ComplaintReply' }],
    createdAt: { type: Date, default: Date.now }
});

const UserComplaint = mongoose.model('UserComplaint', userComplaintSchema);
export default UserComplaint;
