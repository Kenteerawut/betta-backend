import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage(base64Image) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "คุณคือผู้เชี่ยวชาญด้านปลากัด (Betta). วิเคราะห์ภาพนี้และตอบกลับเป็น JSON เท่านั้น โดยใช้ภาษาไทยทั้งหมด " +
          "รูปแบบต้องเป็น:\n" +
          "{\n" +
          '  "species_name": "...",\n' +
          '  "color_traits": "...",\n' +
          '  "care_tips": "..."\n' +
          "}\n" +
          "เงื่อนไข:\n" +
          "- ห้ามใส่เครื่องหมาย ``` หรือข้อความอื่นนอก JSON\n" +
          "- ใช้ภาษาไทยที่เข้าใจง่าย กระชับ\n",
      },
      {
        role: "user",
        content: [
          { type: "text", text: "ช่วยระบุชนิดปลากัดในภาพนี้" },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
    max_tokens: 300,
  });

  let content = response.choices[0].message.content;

  // กันกรณีโมเดลเผลอใส่ ``` มา
  content = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(content);
  } catch (err) {
    throw new Error("OpenAI did not return valid JSON: " + content);
  }
}
