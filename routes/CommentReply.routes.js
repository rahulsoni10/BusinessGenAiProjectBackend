import express from 'express';
import { createCommentReply } from '../controllers/CommentReply.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route POST /api/comment-replies/create
 * @desc Create a reply for a specific comment
 * @access Private
 */
router.post('/create', authMiddleware, createCommentReply);

export default router;
