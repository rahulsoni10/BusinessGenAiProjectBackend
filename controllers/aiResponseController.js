
import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const client = new InferenceClient(process.env.HUGGING_FACE_API_KEY); // Store key in .env

export const getAIReply = async (req, res) => {
  try {
    const { sentiment, feedback } = req.body;

    if (!sentiment || !feedback) {
      return res.status(400).json({ success: false, message: "Sentiment and feedback are required." });
    }

    const chatCompletion = await client.chatCompletion({
  provider: "nebius",
  model: "google/gemma-2-2b-it",
  messages: [
    {
      role: "system",
      content: `You are a helpful customer support assistant. Based on the sentiment and feedback provided, write a short, professional, human-like reply. Do NOT use any placeholders like [Customer Name] or [Your Name]. Write the full message as-is, ready to send. Keep it polite, warm, and direct.`,
    },
    {
      role: "user",
      content: `
Sentiment: ${sentiment}
Customer Feedback: "${feedback}"

Write a ready-to-send reply without using placeholders. If negative, be apologetic and helpful. If positive, thank them. If neutral, acknowledge their feedback. Keep it under 100 words.
      `.trim(),
    },
  ],
});


    const reply = chatCompletion.choices?.[0]?.message?.content || "Sorry, I'm unable to provide a response right now.";

    res.status(200).json({ success: true, reply });
  } catch (error) {
    console.error("AI error:", error);
    res.status(500).json({ success: false, message: "AI service failed." });
  }
};
