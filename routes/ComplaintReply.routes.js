import express from 'express';
import { createComplaintReply } from '../controllers/ComplaintReply.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route POST /api/complaint-replies/create
 * @desc Create a reply for a user complaint
 * @access Private
 */
router.post('/create', authMiddleware, createComplaintReply);

export default router;
