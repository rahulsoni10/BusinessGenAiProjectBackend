// controllers/postController.js
import Post from '../models/postModel.js';
import Image from '../models/imageModel.js';
import { uploadToCloudinary } from '../helpers/cloudinaryHelper.js';
import fs from 'fs';
import cloudinary from '../config/cloudinary.js';

// Create Post
export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userInfo.userId;

    let imageDoc = null;
    if (req.file) {
      const { url, publicId } = await uploadToCloudinary(req.file.path);
      imageDoc = await new Image({ url, publicId, uploadedBy: userId }).save();
      fs.unlinkSync(req.file.path);
    }

    const post = await new Post({
      title,
      description,
      author: userId,
      image: imageDoc?._id || null,
    }).save();
    
    const populatedPost = await Post.findById(post._id)
          .populate({
            path: 'image',
            select: 'url public_id -_id', // Only return useful fields
          });

    res.status(201).json({ success: true, post: populatedPost });

  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
};

// Get All Posts
export const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
          .populate('author', 'name')
  .populate('image')
  .populate({
    path: 'comments',
    populate: [
      { path: 'user', select: 'name' },
      {
        path: 'replies',
        populate: { path: 'user', select: 'name' }  // ⬅️ Populating reply user name
      }
    ]
  });
    res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

// Get One Post
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate("author", "name")
      .populate("image")
      .populate({
        path: "comments",
         populate: [
          { path: "user", select: "name" },
          {
            path: "replies",
            populate: { path: "user", select: "name" } // also get replier name
          }
        ]
      });

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error retrieving post" });
  }
};

// Update Post (title, desc, and optional new image)
export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { title, description } = req.body;
    const userId = req.userInfo.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Not authorized to update this post" });
    }

    // Optional: handle new image
    let newImageDoc = null;
    if (req.file) {
      // Delete old image if exists
      if (post.image) {
        const oldImage = await Image.findById(post.image);
        if (oldImage) {
          await cloudinary.uploader.destroy(oldImage.publicId);
          await Image.findByIdAndDelete(post.image);
        }
      }

      // Upload new image
      const { url, publicId } = await uploadToCloudinary(req.file.path);
      newImageDoc = await new Image({ url, publicId, uploadedBy: userId }).save();
      fs.unlinkSync(req.file.path);
    }

    // Update fields
    post.title = title || post.title;
    post.description = description || post.description;
    if (newImageDoc) post.image = newImageDoc._id;

    await post.save();
    res.status(200).json({ success: true, message: "Post updated", post });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update post" });
  }
};

// Delete Post + delete associated image
export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userInfo.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });
    if (post.author.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    // Delete associated image
    if (post.image) {
      const img = await Image.findById(post.image);
      if (img) {
        await cloudinary.uploader.destroy(img.publicId);
        await Image.findByIdAndDelete(post.image);
      }
    }

    await Post.findByIdAndDelete(postId);
    res.status(200).json({ success: true, message: "Post deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting post" });
  }
};


// Toggle Like Post
export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.userInfo.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    const hasLiked = post.likedBy.includes(userId);

    if (hasLiked) {
      post.likes -= 1;
      post.likedBy.pull(userId); // remove user from likedBy
    } else {
      post.likes += 1;
      post.likedBy.push(userId); // add user to likedBy
    }

    await post.save();

    res.status(200).json({ success: true, liked: !hasLiked, likes: post.likes });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to like/unlike post" });
  }
};

