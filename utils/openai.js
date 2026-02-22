import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧠 GOD JUDGE — BETTA LOCK MODE
 * จำกัดให้ตอบเฉพาะปลากัดเท่านั้น
 */

export async function analyzeBetta({ imageUrl, userPrompt }) {
  try {
    console.log("🔥 BETTA LOCK MODE START");

    const systemPrompt = `
คุณคือผู้เชี่ยวชาญปลากัด (Betta Fish Expert)

กฎสำคัญ:
- ตอบเฉพาะเรื่องปลากัดเท่านั้น
- ห้ามตอบเรื่องอื่น เช่น การเมือง เกม โปรแกรมมิ่ง หรือสัตว์อื่น
- ถ้าผู้ใช้ถามนอกเรื่อง ให้ตอบว่า:
"ระบบนี้ตอบเฉพาะเรื่องปลากัดเท่านั้น"

รูปแบบคำตอบต้องมี:
fishName:
type:
color:
note:
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      temperature: 0.4,
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: userPrompt || "วิเคราะห์ปลากัดจากภาพนี้",
            },
            imageUrl
              ? {
                  type: "image_url",
                  image_url: {
                    url: imageUrl,
                  },
                }
              : null,
          ].filter(Boolean),
        },
      ],
    });

    const text = response.choices?.[0]?.message?.content || "";

    console.log("✅ AI RESPONSE:", text);

    return {
      ok: true,
      text,
    };
  } catch (err) {
    console.error("❌ ANALYZE ERROR:", err);
    return {
      ok: false,
      error: "analyze_failed",
    };
  }
}