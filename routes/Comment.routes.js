import express from 'express';
import { createComment } from '../controllers/Comment.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// This route help user as well as admin to create comment on specific post
router.post('/create', authMiddleware, createComment);

export default router;
