import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧠 GOD JUDGE V7 — STABLE MODE
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD JUDGE V7 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ============================
     * STEP 1 — MORPHOLOGY LOCK
     * ============================
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
คุณคือ Morphology Classifier

ดูเฉพาะโครงสร้างปลา:

Wild Body
Long Fin
Short Fin
Crowntail Spine
Halfmoon Spread

ตอบ TEXT เท่านั้น
`,
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "input_image", image_url: imageDataUrl }],
        },
      ],
    });

    const morph = (classify.output_text || "Unknown").trim();
    console.log("🧬 MORPH =", morph);

    /**
     * ============================
     * STEP 2 — AI ANALYZE
     * ============================
     */
    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือ Thai Betta Judge

Morphology = ${morph}

ตอบ JSON:

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
          content: [{ type: "input_image", image_url: imageDataUrl }],
        },
      ],
    });

    let data;

    if (res.output?.[0]?.content?.[0]?.json) {
      data = res.output[0].content[0].json;
    } else {
      let text = res.output_text || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      data = JSON.parse(text);
    }

    /**
     * ======================================
     * 🧬 GOD JUDGE ENGINE (BIO FILTER)
     * ======================================
     */

    data.morphology = morph;

    const analysis = (data.analysis || "").toLowerCase();

    // ⭐ Rule 1 — Wild lock
    if (morph.includes("Wild") || analysis.includes("wild")) {
      data.main_species_th = "ปลากัดป่า";
      data.main_species_en = "Wild Betta";
      data.breed_category_th = "ปลากัดป่า";
      data.breed_category_en = "Wild Betta";
    }

    // ⭐ Rule 2 — Long Fin ห้ามเป็นหม้อ
    if (morph.includes("Long") && data.main_species_th === "ปลากัดหม้อ") {
      data.main_species_th = "ปลากัดประกวด";
      data.main_species_en = "Show Betta";
    }

    // ⭐ Rule 3 — ไม่มีหนาม ห้าม Crowntail
    if (!analysis.includes("หนาม") && data.breed_category_en?.includes("Crowntail")) {
      data.breed_category_th = "ปลากัดสวยงาม";
      data.breed_category_en = "Domestic Betta";
    }

    // ⭐ Rule 4 — ลำตัวเรียว bias wild
    if (analysis.includes("ลำตัวเรียว")) {
      data.main_species_th = "ปลากัดป่า";
      data.main_species_en = "Wild Betta";
    }

    // ⭐ Confidence normalization
    if (!data.confidence_score || data.confidence_score < 60) {
      data.confidence_score = 68;
    }

    console.log("✅ GOD V7 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD V7 ERROR:", err);
    throw err;
  }
}
