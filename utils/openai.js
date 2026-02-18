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
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text:
                "คุณคือผู้เชี่ยวชาญปลากัด ต้องตอบ JSON เท่านั้น ห้ามอธิบายนอกโครงสร้าง",
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
                "วิเคราะห์ปลากัดจากภาพนี้ และตอบเป็น JSON: {species_name,color_traits,grade,analysis}",
            },
            {
              type: "input_image",
              image_url: imageDataUrl,
            },
          ],
        },
      ],
    });

    const text = res.output_text || "{}";

    let data = {};
    try {
      data = JSON.parse(text);
    } catch {
      data = {
        species_name: "ไม่สามารถระบุ",
        color_traits: "-",
        grade: "-",
        analysis: text,
      };
    }

    return data;
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
}
