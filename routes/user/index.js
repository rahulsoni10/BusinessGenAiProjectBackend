import express from 'express';
import { register, login, logout } from '../../controllers/User.controller.js';
import { registerValidation, loginValidation } from '../../middleware/validation.js';
import authMiddleware from '../../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/users/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidation, register);

/**
 * @route   POST /api/users/login
 * @desc    Login a user
 * @access  Public
 */
router.post('/login', loginValidation, login);

/**
 * @route   POST /api/users/logout
 * @desc    Logout a user
 * @access  Private
 */
router.post('/logout', authMiddleware, logout);

export default router; 