import express from "express";
import { getCommentAIReply, getComplaintAIReply } from "../controllers/aiResponseController.js";

const router = express.Router();

router.post("/suggestComplaintReply", getComplaintAIReply);
router.post("/suggestCommentReply", getCommentAIReply);

export default router;
