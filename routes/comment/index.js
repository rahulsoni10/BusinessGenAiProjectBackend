import express from 'express';
import { createComment } from '../../controllers/Comment.controller.js';
import authMiddleware from '../../middleware/authMiddleware.js';
import { commentValidation } from '../../middleware/validation.js';

const router = express.Router();

/**
 * @route   POST /api/comments/create
 * @desc    Create a comment on a specific post
 * @access  Private
 */
router.post('/create', authMiddleware, commentValidation, createComment);

export default router; 