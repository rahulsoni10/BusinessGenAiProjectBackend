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

    // Check if complaint exists
    const complaint = await UserComplaint.findById(complaintId);
    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    // Create new complaint reply document
    const reply = await new ComplaintReply({
      content,
      userId: userId,
      complaintId: complaintId
    }).save();

    // Add reply reference to the complaint
    await UserComplaint.findByIdAndUpdate(complaintId, {
      $push: { replies: reply._id }
    });

    // Populate user info for response
    const populatedReply = await ComplaintReply.findById(reply._id)
      .populate('userId', 'name email');

    res.status(201).json({ success: true, reply: populatedReply });
  } catch (err) {
    console.error("Error creating complaint reply:", err);
    res.status(500).json({ success: false, message: "Failed to create reply" });
  }
};
