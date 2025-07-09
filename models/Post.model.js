// models/post.model.js
import mongoose from "mongoose";

/**
 * Post Schema
 * @typedef {Object} Post
 * @property {String} title - Post title
 * @property {String} description - Post description
 * @property {mongoose.Types.ObjectId} author - Reference to User
 * @property {Number} likes - Number of likes
 * @property {Array<mongoose.Types.ObjectId>} likedBy - Users who liked the post
 * @property {Array<mongoose.Types.ObjectId>} comments - Comments on the post
 * @property {mongoose.Types.ObjectId} image - Reference to Image
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */
const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: { type: Number, default: 0 },
    likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comment" }],
    image: { type: mongoose.Schema.Types.ObjectId, ref: "Image" },
  },
  {
    timestamps: true,
  }
);

const Post = mongoose.model("Post", postSchema);
export default Post;

