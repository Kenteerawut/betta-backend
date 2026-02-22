import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 BETTA GOD ENGINE START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ======================================
     * PASS 1 — MORPHOLOGY CLASSIFIER
     * ======================================
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

    const morph =
      classify.output?.[0]?.content?.[0]?.text ||
      classify.output_text ||
      "Unknown";

    console.log("🧬 MORPH =", morph);

    /**
     * ======================================
     * PASS 2 — THAI ANALYSIS ENGINE
     * ======================================
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
คุณคือ AI ผู้เชี่ยวชาญการวิเคราะห์ปลากัดระดับกรรมการประกวด

Morphology = ${morph}

⚠️ กฎสำคัญ:
- ตอบเป็นภาษาไทยเท่านั้น
- ห้ามใช้ภาษาอังกฤษ
- ตอบ JSON ONLY
- confidence ต้องเป็นเลข 0.0 ถึง 1.0

รูปแบบ JSON:

{
  "status":"success",
  "features":{
    "tail_shape":"",
    "tail_spread_degree":0,
    "fin_length":"",
    "dorsal_size":"",
    "body_structure":"",
    "primary_color":"",
    "secondary_color":"",
    "color_pattern":"",
    "metallic":false
  },
  "betta_group":"",
  "wild_species":"",
  "tail_type":"",
  "breed_estimate":"",
  "short_reason":"",
  "confidence":0.0
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

    /**
     * ======================================
     * SAFE JSON PARSER (NO CRASH)
     * ======================================
     */
    let data = {};

    try {
      let text =
        res.output?.[0]?.content?.[0]?.text ||
        res.output_text ||
        "{}";

      text = text
        .replace(/```json/gi, "")
        .replace(/```/g, "")
        .trim();

      data = JSON.parse(text);
    } catch (e) {
      console.log("⚠️ JSON FALLBACK", e);
      data = { status: "parse_error" };
    }

    /**
     * ======================================
     * 🧠 GOD JUDGE ENGINE
     * ======================================
     */

    data.morphology = morph;

    const reason = (data.short_reason || "").toLowerCase();

    // ⭐ Wild Lock
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

    // ⭐ Normalize Confidence (กัน 9500%)
    if (typeof data.confidence === "number") {
      if (data.confidence <= 1) {
        data.confidence = Number(data.confidence.toFixed(2));
      } else {
        data.confidence = 0.68;
      }
    } else {
      data.confidence = 0.68;
    }

    console.log("✅ BETTA GOD RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 BETTA GOD ERROR:", err);
    throw err;
  }
}