import UserComplaint from "../models/userComplaintModel.js";

export const raiseComplaint = async (req, res) => {
  try {
    const { orderId, productType, description } = req.body;
    // console.log(req.body);


    if (!orderId || !productType || !description) {
      return res.status(400).json({ error: 'All fields are required.' });
    }
    console.log(req.userInfo.userId);

    const complaint = new UserComplaint({
      orderId,
      productType,
      description,
      userId: req.userInfo.userId
    });

    await complaint.save();
    res.status(201).json({ message: 'Complaint raised successfully.', complaint });
  } catch (error) {
    res.status(500).json({ error: 'Failed to raise complaint.' });
  }
};



export const getUserComplaints = async (req, res) => {
  try {
    const userId = req.userInfo.userId; // assuming authMiddleware sets req.user
    console.log(userId);
    const complaints = await UserComplaint.find({ userId: userId });
    res.json(complaints);
  } catch (error) {
    console.error('Error fetching user complaints:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


