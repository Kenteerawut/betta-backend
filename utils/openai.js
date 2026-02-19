import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 BETTA V4 PRO START");

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
คุณคือผู้เชี่ยวชาญปลากัดระดับนักเพาะไทย

กฎสำคัญ:

1. วิเคราะห์จาก Morphology จริง
2. ต้องแยก tail_type ก่อน
3. ห้ามมั่วคำว่า Fancy ถ้าไม่ชัด
4. ต้องพยายามระบุสายพันธุ์ให้ชัดที่สุด

สายพันธุ์ที่อนุญาต:

ปลากัดหม้อ
ปลากัดจีน
ปลากัดป่า
ปลากัดมหาชัย
Crowntail Betta
Halfmoon Betta
Plakat Betta
Veiltail Betta
Dumbo Ear Betta
Giant Betta
Double Tail Betta

ตอบ JSON เท่านั้น:

{
"main_species_th":"",
"main_species_en":"",
"tail_type_en":"",
"tail_type_th":"",
"special_trait":"",
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

    let text = res.output_text || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    // ⭐ FIX CONFIDENCE
    if (!data.confidence_score || data.confidence_score < 40) {
      data.confidence_score = 65;
    }

    console.log("✅ BETTA V4 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 BETTA V4 ERROR:", err);
    throw err;
  }
}
