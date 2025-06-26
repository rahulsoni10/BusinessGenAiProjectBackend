
import express from "express";
import { getAIReply } from "../controllers/aiResponseController.js";

const router = express.Router();

router.post("/response", getAIReply);

export default router;
