import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA AI — GOD ENGINE (RAILWAY SAFE)
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 BETTA GOD ENGINE START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * =====================================
     * PASS 1 — MORPHOLOGY CLASSIFIER
     * =====================================
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

    // ✅ SAFE OUTPUT READ (Railway Safe)
    const morph =
      classify.output?.[0]?.content?.[0]?.text ||
      classify.output_text ||
      "Unknown";

    console.log("🧬 MORPH =", morph);

    /**
     * =====================================
     * PASS 2 — FINAL ANALYSIS
     * =====================================
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
SYSTEM ROLE:
คุณคือ AI วิเคราะห์ปลากัดระดับผู้เชี่ยวชาญ

Morphology = ${morph}

================================================
PASS 1 — VISUAL FEATURE EXTRACTION
================================================
- tail_shape
- tail_spread_degree
- fin_length
- dorsal_size
- body_structure
- primary_color
- secondary_color
- color_pattern
- metallic

================================================
PASS 2 — GROUP CLASSIFICATION
================================================
WILD:
Betta splendens
Betta mahachaiensis
Betta imbellis
Betta smaragdina
Betta prima
Betta stiktos

FANCY:
Halfmoon, Over Halfmoon, Crowntail,
Plakat, Veiltail, Double Tail,
Delta, Super Delta, Rosetail,
Feathertail, Dumbo Ear

================================================
PASS 3 — CONFIDENCE
================================================
เริ่ม 0.50
+0.15 ถ้า tail ชัด
+0.10 ถ้าสีชัด
+0.10 ถ้าภาพชัด

ตอบ JSON ONLY
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

    /**
     * =====================================
     * SAFE JSON PARSER (ZERO CRASH)
     * =====================================
     */
    let data = {};

    try {
      data =
        res.output?.[0]?.content?.[0]?.json ||
        JSON.parse(res.output_text || "{}");
    } catch (e) {
      console.log("⚠️ JSON FALLBACK");
      data = { status: "parse_error" };
    }

    /**
     * =====================================
     * 🧠 GOD JUDGE ENGINE
     * =====================================
     */

    data.morphology = morph;

    const reason = (data.short_reason || "").toLowerCase();

    // ⭐ Wild lock
    if (morph.includes("Wild")) {
      data.betta_group = "WILD";
    }

    // ⭐ Long fin ห้าม Plakat
    if (morph.includes("Long") && data.tail_type === "Plakat") {
      data.tail_type = "Halfmoon";
    }

    // ⭐ ไม่มีหนาม ห้าม Crowntail
    if (!reason.includes("หนาม") && data.tail_type === "Crowntail") {
      data.tail_type = "Domestic";
    }

    // ⭐ Confidence normalize
    if (!data.confidence || data.confidence < 0.6) {
      data.confidence = 0.68;
    }

    console.log("✅ BETTA GOD RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 BETTA GOD ERROR:", err);
    throw err;
  }
}