import UserComplaint from "../models/userComplaintModel.js";
import fetch from "node-fetch";
import User from "../models/userModel.js";

const classifySeverity = async (description) => {
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/facebook/bart-large-mnli",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        inputs: description,
        parameters: {
          candidate_labels: ["Moderate", "High", "Urgent"],
        },
      }),
    }
  );

  const result = await response.json();
  const predictedSeverity = result?.labels?.[0] || "Moderate";
  return predictedSeverity;
};

export const raiseComplaint = async (req, res) => {
  try {
    const { orderId, productType, description } = req.body;
    
    

    if (!orderId || !productType || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
  //  const severity = await classifySeverity(description);
   const severity = "High";

    const complaint = new UserComplaint({
      orderId,
      productType,
      description,
      userId: req.userInfo.userId,
      severity, // <- save predicted severity
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint raised successfully.', complaint });
  } catch (error) {
    console.error("Complaint error:", error);
    res.status(500).json({ error: 'Failed to raise complaint.' });
  }
};

// export const getUserComplaints = async (req, res) => {
//   try {
//     const userId = req.userInfo.userId; // assuming authMiddleware sets req.user
//     console.log(userId);
//     const complaints = await UserComplaint.find({ userId: userId })
//     .populate({
//       path: "replies",
//       populate: { path: "userId", select: "name" }
//     });
//     res.json(complaints);
//   } catch (error) {
//     console.error('Error fetching user complaints:', error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.userInfo.userId;

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 3;
    const skip = (page - 1) * limit;

    const totalComplaints = await UserComplaint.countDocuments({ userId });

    const complaints = await UserComplaint.find({ userId })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 })
      .populate({
        path: "replies",
        populate: { path: "userId", select: "name" },
      });

    res.json({
      complaints,
      totalPages: Math.ceil(totalComplaints / limit),
      currentPage: page,
      totalComplaints,
    });
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


export const closeComplaint = async (req, res) => {
  try {
    const complaintId = req.params.id;
    const userId = req.userInfo.userId;

    const complaint = await UserComplaint.findById(complaintId);

    if (!complaint) {
      return res.status(404).json({ success: false, message: "Complaint not found." });
    }

    if (complaint.userId.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized to close this complaint." });
    }

    if (complaint.status === "resolved") {
      return res.status(400).json({ success: false, message: "Complaint is already resolved." });
    }

    complaint.status = "resolved";
    await complaint.save();

    res.status(200).json({ success: true, message: "Complaint closed successfully.", complaint });
  } catch (error) {
    console.error("Error closing complaint:", error);
    res.status(500).json({ success: false, message: "Failed to close complaint." });
  }
};

export const getAllUserComplaints = async (req, res) => {
  try {
    const complaints = await UserComplaint.find()
      .populate({
        path: "userId",
        select: "name email", // optional: choose what to return
      })
      .populate({
        path: "replies",
        populate: {
          path: "userId",
          select: "name",
        },
      });

    res.status(200).json({ success: true, complaints });
  } catch (error) {
    console.error("Error fetching all user complaints:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
