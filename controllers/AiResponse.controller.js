import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Initialize Hugging Face Inference Client with API key from environment variables
const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY);

/**
 * Generates a human-like reply to a user comment based on sentiment and description.
 * @route POST /api/ai/comment-reply
 * @body { sentiment: String, description: String }
 * @returns { success: Boolean, reply: String }
 */
export const getCommentAIReply = async (req, res) => {
  try {
    const { sentiment, description } = req.body;

    // Validate required fields
    if (!sentiment || !description) {
      return res.status(400).json({
        success: false,
        message: "Sentiment and description are required.",
      });
    }

    // Generate AI reply using Hugging Face Inference API
    const chatCompletion = await client.chatCompletion({
      provider: "nebius",
      model: "google/gemma-2-2b-it",
      messages: [
        {
          role: "system",
          content:
            "You are a helpful customer support assistant. Based on the sentiment and description provided, write a short, professional, human-like reply. Do NOT use any placeholders like [Customer Name] or [Your Name]. Write the full message as-is, ready to send. Keep it polite, warm, and direct.",
        },
        {
          role: "user",
          content: `\nSentiment: ${sentiment}\nCustomer description: "${description}"\n\nWrite a ready-to-send reply without using placeholders. If negative, be apologetic and helpful. If positive, thank them. If neutral, acknowledge their description. Keep it under 100 words.\n          `.trim(),
        },
      ],
    });

    // Extract reply from AI response or use fallback message
    const reply =
      chatCompletion.choices?.[0]?.message?.content ||
      "Sorry, I'm unable to provide a response right now.";

    // Send success response with AI-generated reply
    res.status(200).json({ success: true, reply });
  } catch (error) {
    // Log error and send failure response
    console.error("AI error:", error);
    res.status(500).json({
      success: false,
      message: "AI service failed.",
    });
  }
};

/**
 * Generates a professional reply to a user complaint based on severity and description.
 * @route POST /api/ai/complaint-reply
 * @body { severity: String, description: String }
 * @returns { success: Boolean, reply: String }
 */
export const getComplaintAIReply = async (req, res) => {
  try {
    const { severity, description } = req.body;

    // Validate required fields
    if (!severity || !description) {
      return res.status(400).json({
        success: false,
        message: "Severity and description are required.",
      });
    }

    // Generate AI reply using Hugging Face Inference API
    const chatCompletion = await client.chatCompletion({
      provider: "nebius",
      model: "google/gemma-2-2b-it",
      messages: [
        {
          role: "system",
          content:
            "You are a professional customer complaint resolution assistant. Based on the severity and description, write a short and empathetic reply. Be helpful, calm, and acknowledge the seriousness based on severity level.",
        },
        {
          role: "user",
          content: `\nSeverity: ${severity}\nComplaint: "${description}"\n\nWrite a polite, human-sounding message ready to be sent. For "Urgent", be especially quick and serious. For "High", be helpful and promise fast resolution. For "Moderate", acknowledge and show intent to fix. Keep it under 100 words.\n          `.trim(),
        },
      ],
    });

    // Extract reply from AI response or use fallback message
    const reply =
      chatCompletion.choices?.[0]?.message?.content ||
      "Sorry, I'm unable to provide a response right now.";

    // Send success response with AI-generated reply
    res.status(200).json({ success: true, reply });
  } catch (error) {
    // Log error and send failure response
    console.error("Complaint AI error:", error);
    res.status(500).json({
      success: false,
      message: "Complaint AI service failed.",
    });
  }
};
