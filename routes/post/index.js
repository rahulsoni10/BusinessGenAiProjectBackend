import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  likePost
} from '../../controllers/Post.controller.js';
import upload from '../../middleware/uploadMiddleware.js';
import authMiddleware, { requireAdmin } from '../../middleware/authMiddleware.js';
import { validatePostFormData } from '../../middleware/validation.js';

const router = express.Router();

/**
 * @route POST /api/posts/create
 * @desc Create a new post (admin only)
 * @access Private/Admin
 */
router.post('/create', authMiddleware, requireAdmin, upload.single('image'), validatePostFormData, createPost);

/**
 * @route GET /api/posts/
 * @desc Get all posts
 * @access Private
 */
router.get('/', authMiddleware, getAllPosts);

/**
 * @route GET /api/posts/:id
 * @desc Get a post by ID
 * @access Private
 */
router.get('/:id', authMiddleware, getPostById);

/**
 * @route PUT /api/posts/:id
 * @desc Update a post (admin only)
 * @access Private/Admin
 */
router.put('/:id', authMiddleware, requireAdmin, upload.single('image'), validatePostFormData, updatePost);

/**
 * @route DELETE /api/posts/:id
 * @desc Delete a post (admin only)
 * @access Private/Admin
 */
router.delete('/:id', authMiddleware, requireAdmin, deletePost);

/**
 * @route PUT /api/posts/:id/like
 * @desc Like or unlike a post
 * @access Private
 */
router.put('/:id/like', authMiddleware, likePost);

export default router; 