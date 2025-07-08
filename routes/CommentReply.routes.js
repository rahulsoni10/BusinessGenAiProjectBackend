import express from 'express';
import { createCommentReply } from '../controllers/CommentReply.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();


// This route help user as well as admin to create reply on specific comment
router.post('/create', authMiddleware, createCommentReply);

export default router;
