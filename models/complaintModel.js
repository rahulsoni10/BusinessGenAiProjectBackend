// models/complaint.model.js

import mongoose from 'mongoose';

const complaintSchema = new mongoose.Schema({
  title: {type: String,required: true,trim: true},
  description: {type: String,required: true},
  user: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  status: {type: String,enum: ['open', 'in_progress', 'resolved'],default: 'open'},
  resolved_by: {type: mongoose.Schema.Types.ObjectId,ref: 'User'},
  resolution_note: {type: String},
  severity: {type: String,enum: ['low', 'medium', 'high'],default: 'medium'}
}, {
  timestamps: true
});

const Complaint = mongoose.model('Complaint', complaintSchema);
export default Complaint;
