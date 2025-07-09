import express from 'express';
import { getUserComplaints, raiseComplaint, closeComplaint, getAllUserComplaints } from '../../controllers/UserComplaint.controller.js';
import authMiddleware, { requireAdmin } from '../../middleware/authMiddleware.js';
import { validateComplaintFormData } from '../../middleware/validation.js';

const router = express.Router();

/**
 * @route POST /api/complaints/raise
 * @desc Raise a new complaint
 * @access Private
 */
router.post('/raise', authMiddleware, validateComplaintFormData, raiseComplaint);

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
router.get('/all', authMiddleware, requireAdmin, getAllUserComplaints);

/**
 * @route PATCH /api/complaints/close/:id
 * @desc Close a complaint by ID
 * @access Private
 */
router.patch('/close/:id', authMiddleware, closeComplaint);

export default router; 