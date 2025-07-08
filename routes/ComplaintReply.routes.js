import express from 'express';
import { createComplaintReply } from '../controllers/ComplaintReply.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// User can raise complaint on this route
router.post('/create', authMiddleware, createComplaintReply);

export default router;
