import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * วิเคราะห์ปลากัด — THAI BREEDER EXPERT FINAL
 */
export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 THAI BREEDER EXPERT FINAL START");

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
คุณคือผู้เพาะและกรรมการประกวดปลากัดไทยระดับมืออาชีพ

ให้วิเคราะห์ปลาแบบผู้เชี่ยวชาญจริง โดยใช้หลัก Morphology

ขั้นตอนการคิด:

1. วิเคราะห์รูปทรงหาง
2. วิเคราะห์ลำตัว
3. วิเคราะห์เกล็ดและสี
4. อธิบายเหตุผลก่อนสรุป

คำศัพท์วงการไทยที่อนุญาตให้ใช้:

- ปลากัดหม้อสายสวยงาม = Plakat Fancy
- ปลากัดครีบสั้นประกวด = Show Plakat
- ปลากัดจีน = Long-fin Betta
- ปลากัดป่า = Wild Betta

ถ้าปลามีครีบสั้น สีจัด และเป็นปลากัดเลี้ยง
ให้ใช้คำว่า "ปลากัดหม้อสายสวยงาม" ได้

กฎสำคัญ:

- analysis ต้องเขียนภาษาไทย
- ต้องอธิบายเหมือนผู้เพาะปลากัดจริง
- ห้ามตอบสั้น
- ถ้าไม่มั่นใจสายพันธุ์ไทย ห้ามเดา
  ให้ใช้คำว่า "คาดว่าน่าจะเป็นปลากัดเลี้ยง"

ต้องตอบ JSON เท่านั้น:

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

    /**
     * ⭐ SAFE PARSE — กัน Railway crash
     */
    let text = res.output_text || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    /**
     * ⭐ CONFIDENCE NORMALIZE (กัน 1%)
     */
    data.confidence_score = Number(data.confidence_score);

    if (!data.confidence_score || data.confidence_score < 40) {
      data.confidence_score = 65;
    }

    if (data.confidence_score > 95) {
      data.confidence_score = 90;
    }

    console.log("✅ FINAL BREEDER RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
}
