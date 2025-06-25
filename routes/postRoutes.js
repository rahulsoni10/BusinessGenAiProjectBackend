import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost
} from '../controllers/postController.js';

const router = express.Router();

// Create new post
router.post('/create', createPost);

// Get all posts
router.get('/', getAllPosts);

// Get single post by ID
router.get('/:id', getPostById);

// Delete a post
router.delete('/:id', deletePost);

// Update a post
router.put('/:id', updatePost);

export default router;
