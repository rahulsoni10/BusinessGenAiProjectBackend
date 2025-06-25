import express from 'express';
import { createComment, getAllComments } from '../controllers/commentController.js';

const router = express.Router();

// Route to create a new comment
router.post('/create', createComment);

// Optional: A test route to confirm it's working
router.get('/create', (req, res) => {
    res.send('Comment creation route is active');
});

// Route to get all comments (you can filter by post or user later)
router.get('/', getAllComments);

export default router;
