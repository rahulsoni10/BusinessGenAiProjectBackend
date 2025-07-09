import express from 'express';
import { register, login } from '../controllers/User.controller.js';
import { raiseComplaint } from '../controllers/UserComplaint.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', register);

/**
 * @route   POST /api/users/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/users/raise
 * @desc    User raises a complaint
 * @access  Private
 */
router.post('/raise', authMiddleware, raiseComplaint);


export default router;
