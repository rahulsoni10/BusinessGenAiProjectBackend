import express from "express";
import { getCommentAIReply, getComplaintAIReply } from "../../controllers/AiResponse.controller.js";
import authMiddleware from "../../middleware/authMiddleware.js";

const router = express.Router();

/**
 * @route POST /api/ai/suggestComplaintReply
 * @desc Generate AI-powered reply for a user complaint
 * @access Private
 */
router.post("/suggestComplaintReply", authMiddleware, getComplaintAIReply);

/**
 * @route POST /api/ai/suggestCommentReply
 * @desc Generate AI-powered reply and sentiment for a comment
 * @access Private
 */
router.post("/suggestCommentReply", authMiddleware, getCommentAIReply);

export default router; 