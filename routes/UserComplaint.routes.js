import express from 'express';
import { getUserComplaints, raiseComplaint, closeComplaint, getAllUserComplaints } from '../controllers/UserComplaint.controller.js';
import authMiddleware from '../middleware/authMiddleware.js';
import adminMiddleware from '../middleware/adminMiddleware.js';
const router = express.Router();

/**
 * @route POST /api/complaints/raise
 * @desc Raise a new complaint
 * @access Private
 */
router.post('/raise', authMiddleware, raiseComplaint);

/**
 * @route GET /api/complaints/user
 * @desc Fetch complaints for the logged-in user
 * @access Private
 */
router.get('/user', authMiddleware, getUserComplaints);

/**
 * @route GET /api/complaints/all
 * @desc Get all complaints (admin only)
 * @access Private/Admin
 */
router.get('/all', authMiddleware, adminMiddleware, getAllUserComplaints);

/**
 * @route PATCH /api/complaints/close/:id
 * @desc Close a complaint by ID
 * @access Private
 */
router.patch('/close/:id', authMiddleware, closeComplaint);

export default router;
