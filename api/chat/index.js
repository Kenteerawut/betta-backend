import express from "express";
import { authRequired } from "../../middleware/auth.middleware.js";
import { askBettaOnly } from "../../utils/openai.js";

const router = express.Router();

/**
 * POST /api/chat
 * body: { question: string, context?: object }
 */
router.post("/", authRequired, async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: "no_question" });
    }

    const answer = await askBettaOnly({
      question,
      context, // ข้อมูลจากผล analyze (optional)
    });

    res.json({
      ok: true,
      answer,
    });
  } catch (err) {
    res.status(500).json({
      error: "chat_failed",
      message: String(err),
    });
  }
});

export default router;
