import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({ imageBase64, question }) {
  const systemPrompt = `
คุณคือผู้เชี่ยวชาญด้านปลากัด (Betta Fish) เท่านั้น

กฎสำคัญ:
- ตอบเฉพาะเรื่องปลากัด: สายพันธุ์ อาการป่วย การรักษา การเลี้ยง
- ถ้าคำถามไม่เกี่ยวกับปลากัด ให้ตอบว่า:
  "ขออภัย ระบบนี้ตอบได้เฉพาะเรื่องปลากัดเท่านั้น"
- ห้ามตอบเรื่องอื่นเด็ดขาด
- ตอบเป็นภาษาไทย เข้าใจง่าย
`;

  const userPrompt = `
คำถามจากผู้ใช้:
${question || "ช่วยวิเคราะห์ปลากัดจากภาพ"}
`;

  const res = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: [
          { type: "input_text", text: userPrompt },
          {
            type: "input_image",
            image_base64: imageBase64,
          },
        ],
      },
    ],
  });

  const answer =
    res.output_text ||
    res.output?.[0]?.content?.[0]?.text ||
    "ไม่สามารถวิเคราะห์ได้";

  return { answer };
}
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Chat เฉพาะเรื่องปลากัด
 */
export async function chatAboutBetta({ question, context }) {
  const systemPrompt = `
คุณคือผู้เชี่ยวชาญด้านปลากัด (Betta fish)
- ตอบได้เฉพาะเรื่องปลากัด การเลี้ยง โรค อาการ การรักษา
- ถ้าคำถามไม่เกี่ยวกับปลากัด ให้ตอบว่า "ผมสามารถตอบได้เฉพาะเรื่องปลากัดเท่านั้น"
- ตอบเป็นภาษาไทย
`;

  const messages = [
    { role: "system", content: systemPrompt },
    ...(context
      ? [
          {
            role: "assistant",
            content: `ข้อมูลปลาก่อนหน้า: ${JSON.stringify(context)}`,
          },
        ]
      : []),
    { role: "user", content: question },
  ];

  const res = await client.chat.completions.create({
    model: "gpt-4o-mini",
    messages,
    temperature: 0.4,
  });

  return res.choices[0].message.content;
}
