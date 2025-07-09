// controllers/commentReplyController.js
import CommentReply from "../models/CommentReply.model.js";
import Comment from "../models/Comment.model.js";

/**
 * Create a reply for a specific comment thread.
 * @route POST /api/comment-replies
 * @body { content: String, commentId: String }
 * @returns { success: Boolean, reply: Object }
 */
export const createCommentReply = async (req, res) => {
  try {
    const { content, commentId } = req.body;
    const userId = req.userInfo.userId;

    // Create new reply document
    const reply = await new CommentReply({
      content,
      user: userId,
      comment: commentId,
    }).save();

    // Add reply reference to the comment
    await Comment.findByIdAndUpdate(commentId, {
      $push: { replies: reply._id },
    });
    await reply.populate("user", "name"); // Populate user name for response

    res.status(201).json({ success: true, reply });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create reply" });
  }
};
