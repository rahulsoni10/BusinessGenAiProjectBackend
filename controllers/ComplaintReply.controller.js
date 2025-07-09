// controllers/complaintReplyController.js
import ComplaintReply from '../models/ComplaintRelpy.model.js';
import UserComplaint from '../models/UserComplaint.model.js';

/**
 * Create a reply for a specific user complaint.
 * @route POST /api/complaint-replies
 * @body { content: String, complaintId: String }
 * @returns { success: Boolean, reply: Object }
 */
export const createComplaintReply = async (req, res) => {
  try {
    const { content, complaintId } = req.body;
    const userId = req.userInfo.userId;

    // Validate required fields
    if (!content || !complaintId) {
      return res.status(400).json({ success: false, message: "Content and complaintId are required." });
    }

    // Create new complaint reply document
    const reply = await new ComplaintReply({
      content,
      user: userId, // Fixed: should be 'user' not 'userId' as per Mongoose model
      complaint: complaintId // Fixed: should be 'complaint' not 'complaintId' as per Mongoose model
    }).save();

    // Add reply reference to the complaint
    await UserComplaint.findByIdAndUpdate(complaintId, {
      $push: { replies: reply._id }
    });

    res.status(201).json({ success: true, reply });
  } catch (err) {
    console.error("Error creating complaint reply:", err);
    res.status(500).json({ success: false, message: "Failed to create reply" });
  }
};
