import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ⭐ MAP ไทย (Educational Mode)
 */
const tailMapTH = {
  Halfmoon: "หางครึ่งวงกลม",
  Crowntail: "หางมงกุฎ",
  Plakat: "หางสั้น",
  Doubletail: "หางคู่",
  "Wild Form": "ทรงป่า",
  Unknown: "ไม่ทราบ",
};

const traitMapTH = {
  "Dumbo Ear": "หูช้าง",
  Giant: "ปลากัดยักษ์",
  Normal: "ปกติ",
};

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 THAI BETTA PRO MAX V6 START");

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

เลือกได้:
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

    const tailTypeEN = (classify.output_text ?? "Unknown").trim();

    console.log("🐟 tail_type =", tailTypeEN);

    /**
     * ==========================
     * STEP 2 — TAXONOMY ANALYZER
     * ==========================
     */
    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      response_format: {
        type: "json_schema",
        json_schema: {
          name: "thai_betta_v6",
          schema: {
            type: "object",
            additionalProperties: false,
            properties: {
              main_species_th: { type: "string" },
              main_species_en: { type: "string" },
              breed_category_th: { type: "string" },
              breed_category_en: { type: "string" },
              special_trait_en: { type: "string" },
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
              "special_trait_en",
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
คุณคือ Thai Betta Specialist

tail_type ถูกล็อกแล้วคือ: ${tailTypeEN}

ต้องตอบชื่อสายพันธุ์แบบไทย เช่น:
ปลากัดหม้อ
ปลากัดจีน
ปลากัดมหาชัย
ปลากัดป่า
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
     * ⭐ FIX รองรับ SDK ทุกเวอร์ชัน (กัน Railway 500)
     */
    let data;

    if (res.output?.[0]?.content?.[0]?.json) {
      data = res.output[0].content[0].json;
    } else {
      let text = res.output_text ?? "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      data = JSON.parse(text);
    }

    /**
     * ==========================
     * EDUCATIONAL MODE — เติมภาษาไทย
     * ==========================
     */
    data.tail_type_en = tailTypeEN;
    data.tail_type_th = tailMapTH[tailTypeEN] || "ไม่ทราบ";

    data.special_trait_th =
      traitMapTH[data.special_trait_en] || "ไม่ระบุ";

    /**
     * CONFIDENCE ENGINE
     */
    if (!data.confidence_score || data.confidence_score < 25) {
      data.confidence_score = 70;
    }

    console.log("✅ PRO MAX V6 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 PRO MAX V6 ERROR:", err);
    throw err;
  }
}
