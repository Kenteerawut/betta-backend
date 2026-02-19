import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * วิเคราะห์ปลากัด (SAFE MODE)
 * ⭐ ไม่มี JSX อยู่ใน backend แน่นอน
 */
export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 BETTA ANALYZE START");

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
คุณคือผู้เชี่ยวชาญปลากัด

วิเคราะห์ปลากัดจากภาพ
และตอบ JSON เท่านั้น

{
"main_species_th":"",
"main_species_en":"",
"breed_category_th":"",
"breed_category_en":"",
"color_traits":"",
"grade":"",
"confidence_score":0,
"analysis":""
}
`,
            },
          ],
        },
        {
          role: "user",
          content: [
            {
              type: "input_image",
              image_url: imageDataUrl,
            },
          ],
        },
      ],
    });

    // ⭐ SAFE PARSE (กัน Railway crash)
    let text = res.output_text || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    console.log("✅ ANALYZE RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
}
