import express from 'express';
import { getUserComplaints, raiseComplaint, closeComplaint, getAllUserComplaints} from '../controllers/userComplaintController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
const router = express.Router();


router.post('/raise', authMiddleware, raiseComplaint);
// Fetch user complaints
router.get('/user', authMiddleware, getUserComplaints);


// Get all complaints (admin)
router.get('/all', authMiddleware, adminMiddleware, getAllUserComplaints);
//Close the complaint
router.patch('/close/:id', authMiddleware, closeComplaint);

export default router;
