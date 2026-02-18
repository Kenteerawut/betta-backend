import express from "express";
import { authRequired } from "../../middleware/auth.middleware.js";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

router.post("/", authRequired, async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: "no_question" });
    }

    console.log("🔥 CHAT QUESTION:", question);

    const ai = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: `คุณคือผู้เชี่ยวชาญปลากัด นี่คือข้อมูลวิเคราะห์ก่อนหน้า:
${JSON.stringify(context)}`,
        },
        {
          role: "user",
          content: question,
        },
      ],
    });

    res.json({
      answer: ai.output_text || "ไม่มีคำตอบ",
    });
  } catch (err) {
    console.error("🔥 CHAT ERROR:", err);

    res.status(500).json({
      error: "chat_failed",
      message: String(err),
    });
  }
});

export default router;
