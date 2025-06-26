import express from 'express';
import { getUserComplaints, raiseComplaint, closeComplaint} from '../controllers/userComplaintController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/raise', authMiddleware, raiseComplaint);
// Fetch all complaints
router.get('/raise', authMiddleware, getUserComplaints);
//Close the complaint
router.put('/:id/close', authMiddleware, closeComplaint);

export default router;
