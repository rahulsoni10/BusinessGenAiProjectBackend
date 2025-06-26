import Comment from '../models/commentModel.js';

export const createComment = async (req, res) => {
  try {
    const comment = new Comment(req.body);
    await comment.save();
    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().populate('user post replies');
    res.status(200).json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
