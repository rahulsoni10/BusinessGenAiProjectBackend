import express from 'express';
import { raiseComplaint } from '../controllers/userComplaintController.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();


router.post('/raise', authMiddleware, raiseComplaint);
router.get('/raise',(req,res)=>{
    res.send("raise a complain");
})


export default router;
