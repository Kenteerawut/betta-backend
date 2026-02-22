import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA GOD ENGINE V10 — THAI PRO+
 * Expert Judge Mode
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 BETTA GOD V10 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ==========================================
     * PASS 1 — MORPHOLOGY CLASSIFIER
     * ==========================================
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
     * ==========================================
     * PASS 2 — EXPERT JUDGE ANALYSIS (THAI PRO+)
     * ==========================================
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
คุณคือ "ผู้เชี่ยวชาญปลากัดระดับประกวด"

วิเคราะห์เหมือน breeder มืออาชีพ:
- ใช้ภาษาไทย + อังกฤษ
- ตั้งชื่อสายพันธุ์แบบคนเลี้ยงใช้จริง
- วิเคราะห์จากโครงสร้าง หาง สี pattern

Morphology = ${morph}

กฎการวิเคราะห์:
- Halfmoon ต้องพูดถึง 180 องศา
- ถ้ามีลายแดง ขาว น้ำเงิน ให้เรียกลายธงชาติ
- Fancy/Marble ต้องระบุ pattern
- ห้ามใช้คำ generic ถ้าระบุได้

ตอบ JSON ONLY:

{
 "status":"success",
 "breed_estimate":"",
 "breed_estimate_th":"",
 "betta_group":"",
 "betta_group_th":"",
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
     * ==========================================
     * ⭐ SAFE JSON PARSER
     * ==========================================
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
     * ==========================================
     * 🧠 GOD JUDGE LOGIC
     * ==========================================
     */

    data.morphology = morph;

    const reason = (data.short_reason || "").toLowerCase();

    // ⭐ Wild lock
    if (morph.includes("Wild")) {
      data.betta_group = "WILD";
      data.betta_group_th = "สายป่า";
    }

    // ⭐ Halfmoon rule
    if (morph.includes("Halfmoon")) {
      data.betta_group = "Halfmoon";
      data.betta_group_th = "ฮาฟมูน";
    }

    // ⭐ Long fin ห้าม Plakat
    if (morph.includes("Long") && data.tail_type === "Plakat") {
      data.tail_type = "Halfmoon";
    }

    // ⭐ ไม่มีหนาม ห้าม Crowntail
    if (!reason.includes("หนาม") && data.tail_type === "Crowntail") {
      data.tail_type = "Domestic";
    }

    /**
     * ==========================================
     * ⭐ CONFIDENCE NORMALIZE (กัน 9500%)
     * ==========================================
     */

    let conf = data.confidence ?? 0;

    if (typeof conf === "number") {
      if (conf <= 1) conf = Math.round(conf * 100);
      else if (conf <= 100) conf = Math.round(conf);
      else conf = 95;
    } else {
      conf = 68;
    }

    data.confidence = conf;

    /**
     * ==========================================
     * ⭐ COMBINE TH + EN DISPLAY
     * ==========================================
     */

    if (data.breed_estimate && data.breed_estimate_th) {
      data.breed_estimate =
        `${data.breed_estimate} (${data.breed_estimate_th})`;
    }

    if (data.betta_group && data.betta_group_th) {
      data.betta_group =
        `${data.betta_group} (${data.betta_group_th})`;
    }

    console.log("✅ BETTA GOD RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 BETTA GOD ERROR:", err);
    throw err;
  }
}