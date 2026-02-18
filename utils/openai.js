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
    console.log("🔥 BETTA AI ULTRA ANALYZE START");

    // ❌ ของเดิมคุณลืมปิด backtick ทำให้ syntax error
    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือผู้เชี่ยวชาญปลากัดระดับนักเพาะมืออาชีพ

ต้องจำแนกปลากัดตาม taxonomy จริงเท่านั้น

หมวดหลักที่อนุญาต:
1) ปลากัดป่า (Wild Betta)
2) ปลากัดหม้อ (Traditional Thai Betta)
3) ปลากัดจีน (Chinese Betta)
4) ปลากัดแฟนซี (Fancy Betta)
5) ปลากัดประกวด (Show Betta)
6) ไม่สามารถระบุได้

ตอบเป็น JSON เท่านั้น
ห้ามมี \`\`\`json
ห้ามมีข้อความนอก JSON
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
วิเคราะห์ปลากัดจากภาพนี้

ตอบ JSON โครงสร้างนี้:

{
  "main_species_th": "",
  "main_species_en": "",
  "sub_type": "",
  "color_traits": "",
  "grade": "",
  "confidence": 0,
  "analysis": ""
}
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

    // ✅ responses API เวอร์ชันใหม่แนะนำแบบนี้
    let text = res.output_text ?? "";

    // กัน AI แอบใส่ markdown
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    console.log("✅ PARSED BETTA JSON =", data);

    return data;
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
}
