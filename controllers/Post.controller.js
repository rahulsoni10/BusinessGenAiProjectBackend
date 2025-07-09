// controllers/postController.js
import Post from '../models/Post.model.js';
import Image from '../models/Image.model.js';
import { uploadToCloudinary } from '../helpers/cloudinaryHelper.js';
import { safeDeleteFile } from '../utils/fileCleanup.js';
import cloudinary from '../config/cloudinary.js';

/**
 * Create a new post with optional image upload.
 * @route POST /api/posts
 * @body { title: String, description: String, file?: File }
 * @returns { success: Boolean, post: Object }
 */
export const createPost = async (req, res) => {
  try {
    const { title, description } = req.body;
    const userId = req.userInfo.userId;

    let imageDoc = null;
    console.log('File received:', req.file);

    // If image file is provided, upload to Cloudinary and save reference
    if (req.file) {
      try {
        const { url, publicId } = await uploadToCloudinary(req.file.path);
        imageDoc = await new Image({ url, publicId, uploadedBy: userId }).save();
      } finally {
        // Always delete the temporary file, even if upload fails
        safeDeleteFile(req.file.path);
      }
    }

    // Create new post document
    const post = await new Post({
      title,
      description,
      author: userId,
      image: imageDoc?._id || null,
    }).save();
    
    // Populate image fields for response
    const populatedPost = await Post.findById(post._id)
      .populate({
        path: 'image',
        select: 'url public_id -_id',
      });

    res.status(201).json({ success: true, post: populatedPost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to create post" });
  }
};

/**
 * Get all posts with author, image, comments, and replies populated.
 * @route GET /api/posts
 * @returns { success: Boolean, posts: Array }
 */
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
            populate: { path: 'user', select: 'name' }
          }
        ]
      });
    res.status(200).json({ success: true, posts });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch posts" });
  }
};

/**
 * Get a single post by ID with all relations populated.
 * @route GET /api/posts/:id
 * @returns { success: Boolean, post: Object }
 */
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
            populate: { path: "user", select: "name" }
          }
        ]
      });

    if (!post) return res.status(404).json({ success: false, message: "Post not found" });

    res.status(200).json({ success: true, post });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error retrieving post" });
  }
};

/**
 * Update a post's title, description, and optionally image. Only the author can update.
 * @route PUT /api/posts/:id
 * @body { title?: String, description?: String, file?: File }
 * @returns { success: Boolean, post: Object }
 */
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
      try {
        const { url, publicId } = await uploadToCloudinary(req.file.path);
        newImageDoc = await new Image({ url, publicId, uploadedBy: userId }).save();
      } finally {
        // Always delete the temporary file, even if upload fails
        safeDeleteFile(req.file.path);
      }
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

/**
 * Delete a post and its associated image. Only the author can delete.
 * @route DELETE /api/posts/:id
 * @returns { success: Boolean, message: String }
 */
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

/**
 * Toggle like/unlike for a post by the current user.
 * @route POST /api/posts/:id/like
 * @returns { success: Boolean, liked: Boolean, likes: Number }
 */
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

