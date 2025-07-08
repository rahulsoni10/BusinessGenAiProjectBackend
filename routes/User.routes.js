import express from 'express';
import { register, login } from '../controllers/User.controller.js';
import { raiseComplaint } from '../controllers/UserComplaint.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();


// User login/ register specific routes
router.post('/register', register);
router.post('/login', login);


// Routes for user to raise complaint
router.post('/raise', authMiddleware, raiseComplaint);


export default router;
