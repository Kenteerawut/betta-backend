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

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        // ⭐ SYSTEM ROLE
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "คุณคือผู้เชี่ยวชาญปลากัดระดับโลก ต้องตอบ JSON เท่านั้น ห้ามมี ```json",
            },
          ],
        },

        // ⭐ USER ROLE
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                question ||
                `
วิเคราะห์ปลากัดจากภาพนี้

ตอบเป็น JSON เท่านั้น:

{
  "main_species_th": "",
  "main_species_en": "",
  "sub_species": "",
  "tail_type": "",
  "color_traits": "",
  "grade": "",
  "confidence_score": 0,
  "analysis": ""
}

ตัวอย่างสายพันธุ์ที่ต้องเลือก:
ปลากัดแฟนซี, ฮาฟมูน, คราวน์เทล, ปลากัดจีน, ปลากัดป่า, ปลากัดหม้อ, Plakat, Fancy Betta
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

    // 🔥 ลบ ```json
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    console.log("✅ PARSED JSON =", data);

    return data;
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
};