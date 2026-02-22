import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA GOD ENGINE — MASTER PROMPT FINAL
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE MASTER START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * =====================================================
     * PASS 1 — MORPHOLOGY DETECTOR
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

ตรวจหา:
Wild Body
Long Fin
Short Fin Plakat
Halfmoon Spread
Crowntail Spine
Elephant Ear Dumbo
Double Tail
Rosetail Feather

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
     * PASS 2 — MASTER PROMPT FINAL
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
คุณคือ "ผู้ตัดสินปลากัดระดับประกวด (Professional Betta Judge)"

Morphology = ${morph}

================================================
📊 วิเคราะห์ตาม Layer ต่อไปนี้
================================================

1️⃣ Origin Group
- Wild Betta
- Fancy Betta
- Hybrid Fancy

กฎ:
- ถ้ามี Wild Body → ต้องเป็น Wild Betta
- Wild ห้าม override เป็น Halfmoon

------------------------------------------------

2️⃣ Structure Type
Halfmoon
Crowntail
Plakat
Double Tail
Veiltail
Rosetail
Dumbo Ear / Elephant Ear

กฎ:
- Crowntail Spine → Crowntail
- Halfmoon Spread → ต้องพูดถึง 180°
- Long Fin → ห้าม Plakat
- Elephant Ear = ครีบอกใหญ่ ต้องมีคำว่า หูช้าง

------------------------------------------------

3️⃣ Pattern Type
Marble
Koi
Fancy
Galaxy
Dragon Scale
Patriotic

Pattern ห้าม override Structure

------------------------------------------------

4️⃣ Color Group
Red
Blue
Black
Yellow
Metallic
White
Multicolor

================================================
🧠 LOCKED RULES
================================================
Morphology Priority > Structure > Pattern > Color

================================================
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
     * 🧠 MASTER JUDGE LOGIC (FINAL)
     * =====================================================
     */

    data.morphology = morph;

    const reason = (data.short_reason || "").toLowerCase();

    // ⭐ Wild Lock
    if (morph.includes("Wild")) {
      data.origin_group = "Wild Betta";
      data.origin_group_th = "ปลากัดป่า";
    }

    // ⭐ Elephant Ear
    if (morph.includes("Elephant") || reason.includes("หูช้าง")) {
      data.morphology =
        (data.morphology || "") + " Elephant Ear Dumbo";
    }

    // ⭐ Structure Mapping
    if (morph.includes("Halfmoon")) {
      data.structure_type = "Halfmoon";
      data.structure_type_th = "ฮาฟมูน";
    }

    if (morph.includes("Crowntail")) {
      data.structure_type = "Crowntail";
      data.structure_type_th = "คราวน์เทล";
    }

    if (morph.includes("Short")) {
      data.structure_type = "Plakat";
      data.structure_type_th = "ปลากัดครีบสั้น";
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

    console.log("✅ MASTER RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD ENGINE ERROR:", err);
    throw err;
  }
}