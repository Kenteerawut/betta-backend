import express from "express";
import { authRequired } from "../../middleware/auth.middleware.js";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/chat (streaming)
router.post("/", authRequired, async (req, res) => {
  try {
    const { question, context } = req.body;

    if (!question) {
      return res.status(400).json({ error: "missing_question" });
    }

    // บังคับขอบเขต: คุยได้เฉพาะปลากัด
    const systemPrompt = `
คุณคือผู้เชี่ยวชาญด้านปลากัด (Betta fish) เท่านั้น
- ตอบเฉพาะเรื่องปลากัด การเลี้ยง โรค อาการ การรักษา
- ถ้าถามนอกเรื่อง ให้ปฏิเสธอย่างสุภาพ
- ใช้ภาษาไทย เข้าใจง่าย
`;

    res.setHeader("Content-Type", "text/plain; charset=utf-8");
    res.setHeader("Transfer-Encoding", "chunked");

    const stream = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "assistant",
          content: context
            ? `ผลการวิเคราะห์ปลากัด:\n${JSON.stringify(context, null, 2)}`
            : "",
        },
        { role: "user", content: question },
      ],
    });

    for await (const chunk of stream) {
      const text = chunk.choices?.[0]?.delta?.content;
      if (text) {
        res.write(text);
      }
    }

    res.end();
  } catch (err) {
    console.error(err);
    res.status(500).end("chat_failed");
  }
});

export default router;
