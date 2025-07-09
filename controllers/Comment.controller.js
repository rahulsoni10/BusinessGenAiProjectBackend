import Post from '../models/Post.model.js';
import Comment from '../models/Comment.model.js';
import fetch from 'node-fetch';

/**
 * Helper function to classify sentiment of a customer comment using Hugging Face Inference API.
 * @param {string} customerComment - The comment text to analyze.
 * @returns {Promise<string>} - Returns 'Positive', 'Neutral', 'Negative', or 'Unknown'.
 */
async function classifySentiment(customerComment) {
  // Call Hugging Face sentiment analysis model
  const response = await fetch(
    "https://router.huggingface.co/hf-inference/models/cardiffnlp/twitter-roberta-base-sentiment",
    {
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({ inputs: customerComment }),
    }
  );

  let result = await response.json();
  result = result[0] ? result[0] : [];

  // Handle API error or unexpected response
  if (!Array.isArray(result) || !result[0]?.label) {
    console.error("Invalid response:", result);
    return "Unknown";
  }

  // Extract top label from API response
  const topLabel = result[0].label;

  // Map Hugging Face label to human-readable sentiment
  const labelMap = {
    "LABEL_0": "Negative",
    "LABEL_1": "Neutral",
    "LABEL_2": "Positive"
  };
  const sentiment = labelMap[topLabel] || "Unknown";
  return sentiment;
}

/**
 * Controller to create a new comment on a post, with automatic sentiment classification.
 * @route POST /api/comments
 * @body { content: String, postId: String }
 * @returns { success: Boolean, comment: Object }
 */
export const createComment = async (req, res) => {
  try {
    const { content, postId } = req.body;
    const userId = req.userInfo.userId;

    // Classify sentiment using helper
    const sentiment = await classifySentiment(content);

    // Create new comment document
    const newComment = await new Comment({
      content,
      sentiment,
      user: userId,
      post: postId,
    }).save();

    // Add comment reference to the corresponding post
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create comment" });
  }
};
