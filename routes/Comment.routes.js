import express from 'express';
import { createComment } from '../controllers/Comment.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/comments/create
 * @desc    Create a comment on a specific post
 * @access  Private
 */
router.post('/create', authMiddleware, createComment);

export default router;
