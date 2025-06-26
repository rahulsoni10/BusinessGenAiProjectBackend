import express from 'express';
import { createCommentReply } from '../controllers/commentReplyController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

router.post('/create', authMiddleware, createCommentReply);

export default router;
