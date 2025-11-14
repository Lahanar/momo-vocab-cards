// server.js
import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

// Initialize OpenAI client with API key from environment variable
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// POST endpoint for checking quiz answers
app.post("/check-answer", async (req, res) => {
  const { userAnswer, correctAnswer } = req.body;

  if (!userAnswer || !correctAnswer) {
    return res.status(400).json({ error: "Missing userAnswer or correctAnswer" });
  }

  try {
    const prompt = `
User answer: "${userAnswer}"
Correct definition: "${correctAnswer}"
Check if the user answer is correct. Reply only "yes" if correct, "no" if incorrect.
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [{ role: "user", content: prompt }],
      temperature: 0
    });

    const result = response.choices[0].message.content.trim().toLowerCase();
    res.json({ correct: result === "yes" });

  } catch (error) {
    console.error("OpenAI API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
