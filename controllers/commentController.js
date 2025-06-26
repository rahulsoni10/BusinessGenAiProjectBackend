import Post from '../models/postModel.js';
import Comment from '../models/commentModel.js';
import fetch from 'node-fetch';


async function classifySentiment(customerComment) {
	
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

    result = result[0] ? result[0]: [];
    
	// Handle API error
	if (!Array.isArray(result) || !result[0]?.label) {
		console.error("Invalid response:", result);
		return "Unknown";
	}

	// Extract top label
	const topLabel = result[0].label;

	// Map label to sentiment
	const labelMap = {
		"LABEL_0": "Negative",
		"LABEL_1": "Neutral",
		"LABEL_2": "Positive"
	};
	const sentiment = labelMap[topLabel] || "Unknown";
	return sentiment;
}

export const createComment = async (req, res) => {
  try {
    
    const { content, postId } = req.body;
    const userId = req.userInfo.userId;

    const sentiment = await classifySentiment(content);

    const newComment = await new Comment({
      content,
      sentiment,
      user: userId,
      post: postId,
    }).save();

    //  Add comment reference to Post
    await Post.findByIdAndUpdate(postId, {
      $push: { comments: newComment._id },
    });

    res.status(201).json({ success: true, comment: newComment });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create comment" });
  }
};
