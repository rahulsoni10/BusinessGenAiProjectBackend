import express from 'express';
import { createComplaintReply } from '../controllers/complaintReplyController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createComplaintReply);

export default router;
