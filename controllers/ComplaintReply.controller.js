// controllers/complaintReplyController.js
import ComplaintReply from '../models/ComplaintRelpy.model.js'
import UserComplaint from '../models/UserComplaint.model.js';

export const createComplaintReply = async (req, res) => {
  try {
    const { content, complaintId } = req.body;
    const userId = req.userInfo.userId;
    
    if (!content || !complaintId) {
      return res.status(400).json({ success: false, message: "Content and complaintId are required." });
    }

    // Create reply
    const reply = await new ComplaintReply({
      content,
      userId,
      complaintId
    }).save();
    
    // Push reply ID to complaint
    await UserComplaint.findByIdAndUpdate(complaintId, {
      $push: { replies: reply._id }
    });

    res.status(201).json({ success: true, reply });
  } catch (err) {
    console.error("Error creating complaint reply:", err);
    res.status(500).json({ success: false, message: "Failed to create reply" });
  }
};
