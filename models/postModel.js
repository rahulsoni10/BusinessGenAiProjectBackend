// models/post.model.js
import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: { type: Number, default: 0 },
  comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
  image: { type: mongoose.Schema.Types.ObjectId, ref: 'Image', required: false }, // Now store Image ID
}, {
  timestamps: true
});

const Post = mongoose.model('Post', postSchema);
export default Post;
