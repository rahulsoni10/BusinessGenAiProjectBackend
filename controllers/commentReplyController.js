// controllers/commentReplyController.js
import CommentReply from "../models/commentReplyModel.js";
import Comment from "../models/commentModel.js";

export const createCommentReply = async (req, res) => {
  try {
    const { content, commentId } = req.body;
    const userId = req.userInfo.userId;

    const reply = await new CommentReply({
      content,
      user: userId,
      comment: commentId,
    }).save();

    // Add reply reference to comment
    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id },
    });

    res.status(201).json({ success: true, reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create reply" });
  }
};
