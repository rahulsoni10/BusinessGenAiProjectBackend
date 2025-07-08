import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  deletePost,
  updatePost,
  likePost
} from '../controllers/Post.controller.js';

import upload from '../middleware/uploadMiddleware.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';

const router = express.Router();


// All post related routes for both role, protected by user and admin middlewares

router.post('/create', authMiddleware, adminMiddleware, upload.single('image'), createPost);
router.get('/', authMiddleware, getAllPosts);
router.get('/:id', authMiddleware, getPostById);
router.put('/:id', authMiddleware, adminMiddleware, upload.single('image'), updatePost);
router.delete('/:id', authMiddleware, adminMiddleware, deletePost);
router.put('/:id/like', authMiddleware, likePost);


export default router;
