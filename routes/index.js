import express from 'express';
import userRoutes from './user/index.js';
import postRoutes from './post/index.js';
import commentRoutes from './comment/index.js';
import commentReplyRoutes from './comment/replies.js';
import complaintRoutes from './complaint/index.js';
import complaintReplyRoutes from './complaint/replies.js';
import aiRoutes from './ai/index.js';

const router = express.Router();

// Mount routes
router.use('/users', userRoutes);
router.use('/posts', postRoutes);
router.use('/comments', commentRoutes);
router.use('/comment-replies', commentReplyRoutes);
router.use('/complaints', complaintRoutes);
router.use('/complaint-replies', complaintReplyRoutes);
router.use('/ai', aiRoutes);

export default router; 