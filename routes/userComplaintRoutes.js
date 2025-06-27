import express from 'express';
import { getUserComplaints, raiseComplaint, closeComplaint, getAdminComplaints} from '../controllers/userComplaintController.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
const router = express.Router();


router.post('/raise', authMiddleware, raiseComplaint);
// Fetch all complaints
router.get('/raise', authMiddleware, getUserComplaints);
//Close the complaint
router.put('/:id/close', authMiddleware, closeComplaint);



// admin controllers

router.get('/admin/allcomplaints', authMiddleware,adminMiddleware, getAdminComplaints);

export default router;
