import express from 'express';
import { getUserComplaints, raiseComplaint } from '../controllers/userComplaintController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/raise', authMiddleware, raiseComplaint);
// Fetch all complaints
router.get('/raise', authMiddleware, getUserComplaints);



export default router;
