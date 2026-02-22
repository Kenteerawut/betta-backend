import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA GOD ENGINE V11 — FULL TAXONOMY
 * Origin → Structure → Pattern → Breed
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
     * PASS 1 — MORPHOLOGY SCAN
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
คุณคือ Betta Morphology Scanner

เลือกได้หลายค่า:
Wild Body
Long Fin
Short Fin
Crowntail Spine
Halfmoon Spread
Plakat Form
Double Tail

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
     * =====================================================
     * PASS 2 — FULL TAXONOMY JUDGE
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
คุณคือกรรมการประกวดปลากัดระดับ breeder

วิเคราะห์เป็น 4 Layer:

1️⃣ origin_group:
- WILD
- FANCY
- HYBRID

2 people's Structure:
Halfmoon
Crowntail
Plakat
Double Tail
Veiltail
Rosetail
Dumbo Ear

3️⃣ pattern_type:
Marble
Fancy
Galaxy
Koi
Nemo
Samurai
Flag Pattern
Dragon Scale
Metallic

กฎสำคัญ:
- Halfmoon ต้องกล่าวถึง 180°
- หนามยาว = Crowntail
- สีแดง ขาว น้ำเงิน = Flag Pattern
- ห้ามตอบ generic ถ้าระบุได้

ตอบ JSON ONLY:

{
 "status":"success",
 "origin_group":"",
 "origin_group_th":"",
 "structure_type":"",
 "structure_type_th":"",
 "pattern_type":"",
 "pattern_type_th":"",
 "breed_estimate":"",
 "breed_estimate_th":"",
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
     * 🧠 GOD JUDGE LOGIC (ANTI BUG)
     * =====================================================
     */

    data.morphology = morph;

    // ⭐ Origin Auto Lock
    if (morph.includes("Wild")) {
      data.origin_group = "WILD";
      data.origin_group_th = "สายป่า";
    }

    // ⭐ Structure Lock จาก Morphology
    if (morph.includes("Crowntail")) {
      data.structure_type = "Crowntail";
      data.structure_type_th = "คราวน์เทล";
    }

    if (morph.includes("Halfmoon")) {
      data.structure_type = "Halfmoon";
      data.structure_type_th = "ฮาฟมูน";
    }

    if (morph.includes("Short")) {
      data.structure_type = "Plakat";
      data.structure_type_th = "ปลากัดครีบสั้น";
    }

    /**
     * =====================================================
     * ⭐ CONFIDENCE NORMALIZE
     * =====================================================
     */
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
     * ⭐ COMBINE TH + EN (UI READY)
     * =====================================================
     */

    if (data.origin_group && data.origin_group_th) {
      data.origin_group =
        `${data.origin_group} (${data.origin_group_th})`;
    }

    if (data.structure_type && data.structure_type_th) {
      data.structure_type =
        `${data.structure_type} (${data.structure_type_th})`;
    }

    if (data.pattern_type && data.pattern_type_th) {
      data.pattern_type =
        `${data.pattern_type} (${data.pattern_type_th})`;
    }

    if (data.breed_estimate && data.breed_estimate_th) {
      data.breed_estimate =
        `${data.breed_estimate} (${data.breed_estimate_th})`;
    }

    console.log("✅ GOD ENGINE V11 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD ENGINE V11 ERROR:", err);
    throw err;
  }
}