// models/comment.model.js

import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  description: {type: String,required: true},
  user: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  post: {type: mongoose.Schema.Types.ObjectId,ref: 'Post',required: true},
  sentiment: {type: String,enum: ['positive', 'negative', 'neutral'],default: 'neutral'},
  replies: [{type: mongoose.Schema.Types.ObjectId,ref: 'Reply'}]
}, 
{
  timestamps: true
});

const Comment = mongoose.model('Comment', commentSchema);
export default Comment;
