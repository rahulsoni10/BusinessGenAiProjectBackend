// models/reply.model.js

import mongoose from 'mongoose';

const replySchema = new mongoose.Schema({
  content: {type: String,required: true},
  userid: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  target_type: {type: String,enum: ['post', 'comment', 'complaint'],required: true},
  target_id: {type: mongoose.Schema.Types.ObjectId,required: true},
  is_private: {type: Boolean,default: false}
}, 
{
  timestamps: true
});

const Reply = mongoose.model('Reply', replySchema);
export default Reply;

// How It Works
// A reply to a post will have target_type: 'post' and target_id: <post_id>.
// A reply to a comment will have target_type: 'comment' and target_id: <comment_id>.
// A reply to a complaint will have target_type: 'complaint' and is_private: true.
