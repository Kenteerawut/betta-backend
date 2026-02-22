import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA GOD ENGINE V11 — FINAL MASTER
 * วิเคราะห์ได้ทุกสาย ไม่ bias
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE V11 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * =====================================================
     * PASS 1 — STRUCTURE DETECTOR (NO LOCK TYPE)
     * =====================================================
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
คุณคือ Morphology Detector ปลากัด

ตรวจหา structure ต่อไปนี้:
- Wild Body
- Long Fin
- Short Fin Plakat
- Halfmoon Spread 180 Degree
- Crowntail Spine
- Elephant Ear Dumbo
- Double Tail
- Rosetail Feather

ตอบ TEXT ONLY
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
     * =====================================================
     * PASS 2 — EXPERT JUDGE MASTER
     * =====================================================
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
คุณคือ "กรรมการปลากัดระดับประกวด"

วิเคราะห์แบบ breeder จริง:
- ห้าม lock เป็น Wild/Fancy ถ้าไม่ชัด
- วิเคราะห์ tail, fin, body, color pattern
- ถ้าครีบอกใหญ่ต้องเรียก Elephant Ear (หูช้าง)
- Halfmoon ต้องพูดถึง 180 องศา
- Crowntail ต้องมี spine
- Plakat = ครีบสั้น

Morphology = ${morph}

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
     * =====================================================
     * SAFE JSON PARSER
     * =====================================================
     */
    let data = {};

    try {
      let text =
        res.output?.[0]?.content?.[0]?.text ||
        res.output_text ||
        "{}";

      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();

      data = JSON.parse(text);
    } catch (e) {
      console.log("⚠️ JSON FALLBACK", e);
      data = { status: "parse_error" };
    }

    /**
     * =====================================================
     * 🧠 GOD JUDGE MASTER LOGIC
     * =====================================================
     */

    data.morphology = morph;

    const reason = (data.short_reason || "").toLowerCase();

    // ⭐ Elephant Ear Detection
    if (
      morph.includes("Elephant") ||
      reason.includes("หูช้าง")
    ) {
      data.morphology =
        (data.morphology || "") + " Elephant Ear Dumbo";
    }

    // ⭐ Halfmoon Rule
    if (morph.includes("Halfmoon")) {
      data.betta_group = "Halfmoon";
      data.betta_group_th = "ฮาฟมูน";
    }

    // ⭐ Crowntail Rule
    if (morph.includes("Crowntail")) {
      data.betta_group = "Crowntail";
      data.betta_group_th = "คราวน์เทล";
    }

    // ⭐ Plakat Rule
    if (morph.includes("Short")) {
      data.betta_group = "Plakat";
      data.betta_group_th = "ปลากัดครีบสั้น";
    }

    // ⭐ Confidence Normalize
    let conf = data.confidence ?? 0;

    if (typeof conf === "number") {
      if (conf <= 1) conf = Math.round(conf * 100);
      else if (conf <= 100) conf = Math.round(conf);
      else conf = 95;
    } else {
      conf = 70;
    }

    data.confidence = conf;

    /**
     * =====================================================
     * COMBINE TH + EN
     * =====================================================
     */

    if (data.breed_estimate && data.breed_estimate_th) {
      data.breed_estimate =
        `${data.breed_estimate} (${data.breed_estimate_th})`;
    }

    if (data.betta_group && data.betta_group_th) {
      data.betta_group =
        `${data.betta_group} (${data.betta_group_th})`;
    }

    console.log("✅ GOD ENGINE RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD ENGINE ERROR:", err);
    throw err;
  }
}