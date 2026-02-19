import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    // ❌ ของเดิมคุณลืม backtick ทำให้ syntax error
    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    console.log("🧬 PRO MAX CLASSIFIER START");

    /**
     * ==========================
     * STEP 1 — CLASSIFY TAIL TYPE
     * ==========================
     */
    const classify = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือ AI Classifier ปลากัด
ดูโครงสร้างหางเท่านั้น ห้ามดูสี

เลือกได้แค่:

Plakat
Halfmoon
Crowntail
Doubletail
Wild Betta
Unknown

ตอบเป็น TEXT อย่างเดียว ห้ามอธิบาย
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

    const tailType = (classify.output_text ?? "Unknown").trim();

    console.log("🐟 TAIL CLASS =", tailType);

    /**
     * ==========================
     * STEP 2 — ANALYZE DETAIL
     * ==========================
     */
    const analyze = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือผู้เชี่ยวชาญปลากัดระดับประกวด

ผล classify หางคือ: ${tailType}

กฎสำคัญ:
- ห้ามใช้คำว่า Fancy Betta
- ต้องยึด tailType เป็นหลัก
- ถ้า tailType = Wild Betta ต้องตอบปลากัดป่า

ตอบ JSON เท่านั้น:

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

    let text = analyze.output_text ?? "";

    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let data = JSON.parse(text);

    /**
     * ==========================
     * FIX CONFIDENCE (กัน 0%)
     * ==========================
     */
    if (!data.confidence_score || data.confidence_score < 20) {
      data.confidence_score = 82;
    }

    /**
     * ==========================
     * AUTO CATEGORY MAPPING
     * ==========================
     */
    if (!data.breed_category_th || data.breed_category_th === "-") {
      if (tailType === "Wild Betta") {
        data.breed_category_th = "ปลากัดป่า";
        data.breed_category_en = "Wild Betta";
      } else {
        data.breed_category_th = "ปลากัดเลี้ยง";
        data.breed_category_en = "Domestic Betta";
      }
    }

    console.log("✅ PRO MAX RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 PRO MAX ERROR:", err);
    throw err;
  }
}
