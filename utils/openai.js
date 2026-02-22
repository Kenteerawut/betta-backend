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
     * ===============================
     * PASS 1 — MORPHOLOGY
     * ===============================
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
     * ===============================
     * PASS 2 — ANALYSIS
     * ===============================
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

ตอบ JSON ONLY:
{
  "status":"",
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
  "confidence":0
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
     * ===============================
     * ⭐ SAFE JSON PARSER (FIXED)
     * ===============================
     */
    let data = {};

    try {
      let text =
        res.output?.[0]?.content?.[0]?.text ||
        res.output_text ||
        "{}";

      // 🔥 ตัด ```json ``` ที่ทำให้ parse พัง
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
     * ===============================
     * GOD JUDGE
     * ===============================
     */

    data.morphology = morph;

    const reason = (data.short_reason || "").toLowerCase();

    if (morph.includes("Wild")) {
      data.betta_group = "WILD";
    }

    if (morph.includes("Long") && data.tail_type === "Plakat") {
      data.tail_type = "Halfmoon";
    }

    if (!reason.includes("หนาม") && data.tail_type === "Crowntail") {
      data.tail_type = "Domestic";
    }

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