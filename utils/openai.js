import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 THAI BETTA PRO MAX V5 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ==========================
     * STEP 1 — MORPHOLOGY CLASSIFIER
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
คุณคือ Morphology Classifier ปลากัด

ดูเฉพาะรูปทรงหางเท่านั้น

เลือกได้เท่านั้น:

Plakat
Halfmoon
Crowntail
Doubletail
Wild Form
Unknown

ตอบ TEXT อย่างเดียว
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

    console.log("🐟 LOCKED tail_type =", tailType);

    /**
     * ==========================
     * STEP 2 — TAXONOMY ANALYZER (SCHEMA LOCK)
     * ==========================
     */
    const res = await openai.responses.create({
      model: "gpt-4.1-mini",

      response_format: {
        type: "json_schema",
        json_schema: {
          name: "thai_betta_taxonomy",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              main_species_th: { type: "string" },
              main_species_en: { type: "string" },
              breed_category_th: { type: "string" },
              breed_category_en: { type: "string" },
              tail_type: { type: "string" },
              color_traits: { type: "string" },
              grade: { type: "string" },
              confidence_score: { type: "number" },
              analysis: { type: "string" },
            },
            required: [
              "main_species_th",
              "main_species_en",
              "breed_category_th",
              "breed_category_en",
              "tail_type",
              "color_traits",
              "grade",
              "confidence_score",
              "analysis",
            ],
          },
        },
      },

      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือ Thai Betta Taxonomy Specialist

tail_type ถูกล็อกแล้วคือ: ${tailType}

กฎสำคัญ:

- tail_type ห้ามเปลี่ยน
- Halfmoon / Crowntail / Plakat = รูปทรงหาง ไม่ใช่สายพันธุ์
- ต้องเลือกสายพันธุ์หลักแบบไทย เช่น:
  ปลากัดหม้อ
  ปลากัดจีน
  ปลากัดมหาชัย
  ปลากัดป่า
  ไม่สามารถระบุได้

ถ้าไม่มั่นใจ ห้าม confidence เกิน 70
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

    const data = res.output[0].content[0].json;

    /**
     * ==========================
     * CONFIDENCE ENGINE
     * ==========================
     */
    if (!data.confidence_score || data.confidence_score < 25) {
      data.confidence_score = 65;
    }

    if (tailType === "Unknown" && data.confidence_score > 60) {
      data.confidence_score = 60;
    }

    // ⭐ Inject locked tail_type
    data.tail_type = tailType;

    console.log("✅ PRO MAX V5 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 PRO MAX V5 ERROR:", err);
    throw err;
  }
}
