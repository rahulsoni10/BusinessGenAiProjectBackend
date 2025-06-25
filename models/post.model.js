// models/post.model.js

import mongoose from 'mongoose';

const postSchema = new mongoose.Schema({
  title: {type: String,required: true,trim: true},
  description: {type: String,required: true},
  author: {type: mongoose.Schema.Types.ObjectId,ref: 'User',required: true},
  likes: {type: Number,default: 0},
  comments: [{type: mongoose.Schema.Types.ObjectId,ref: 'Comment'}],
  image_url: {type: String,required: false}}, 
  {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;
