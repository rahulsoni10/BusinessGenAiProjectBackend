import express from "express";
import { getCommentAIReply, getComplaintAIReply } from "../controllers/AiResponse.controller.js";

const router = express.Router();

// For Ai generated reply on Particular complaint
router.post("/suggestComplaintReply", getComplaintAIReply);


// For Ai generated reply and sentiment for Comment
router.post("/suggestCommentReply", getCommentAIReply);

export default router;
