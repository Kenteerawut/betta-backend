import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
  question = "",
}) {
  try {
    console.log("🔥 PRO ANALYZE START");

    const imageDataUrl = data:${mimeType};base64,${imageBase64};

    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      temperature: 0.2,
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือผู้เชี่ยวชาญปลากัดระดับประกวด
ตอบเป็น JSON เท่านั้น ห้ามมีข้อความอื่น
`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                question ||
                `
วิเคราะห์ปลากัดจากภาพนี้ และตอบ JSON ตาม schema:

{
  "fishName": "",
  "type": "",
  "tailType": "",
  "color": "",
  "grade": "",
  "confidence": 0,
  "answer": ""
}

กฎ:
- confidence = 0-100
- grade = A/B/C
- tailType เช่น Halfmoon, Crowntail, Plakat
`,
            },
            {
              type: "input_image",
              image_url: imageDataUrl,
            },
          ],
        },
      ],
    });

    let text = res.output_text || "";

    console.log("🔥 RAW AI:", text);

    let parsed;

    try {
      parsed = JSON.parse(text);
    } catch {
      console.log("⚠️ AI ไม่ส่ง JSON — fallback");
      parsed = {
        fishName: "",
        type: "",
        tailType: "",
        color: "",
        grade: "",
        confidence: 0,
        answer: text,
      };
    }

    return parsed;
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
}
ส่