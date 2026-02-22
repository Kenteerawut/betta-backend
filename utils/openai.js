import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA GOD ENGINE V12 — FINAL DEFENSE VERSION
 * ✔ Wild priority
 * ✔ Dumbo detection
 * ✔ Crowntail not override Wild
 * ✔ Breeder Logic จริง
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE V12 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * =====================================================
     * PASS 1 — STRUCTURE DETECTOR (MULTI LABEL)
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
คุณคือ Morphology Detector ปลากัด (Breeder Standard)

ตรวจหาโครงสร้าง:
- Wild Body
- Long Fin
- Short Fin Plakat
- Halfmoon Spread 180 Degree
- Crowntail Spine (web reduction เท่านั้น)
- Elephant Ear Dumbo (pectoral ใหญ่)
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
คุณคือกรรมการปลากัดระดับประกวด

วิเคราะห์แบบ breeder:
- อย่า lock Fancy/Wild ถ้าไม่ชัด
- Halfmoon ต้องกล่าวถึง 180 องศา
- Dumbo = ครีบอกใหญ่ (หูช้าง)
- Crowntail ต้องมี web reduction
- Wild ต้องดู body shape ก่อน

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
     * 🧠 GOD JUDGE FINAL PRIORITY SYSTEM
     * =====================================================
     */

    data.morphology = morph;

    const m = (morph || "").toLowerCase();
    const r = (data.short_reason || "").toLowerCase();

    let groupEN = "";
    let groupTH = "";

    /**
     * PRIORITY ORDER (สำคัญมาก)
     * Wild > Dumbo > Crowntail > Halfmoon > Plakat
     */

    // ⭐ 1. WILD FIRST
    if (m.includes("wild")) {
      groupEN = "Wild Betta";
      groupTH = "ปลากัดป่า";
    }

    // ⭐ 2. DUMBO (Elephant Ear)
    else if (m.includes("elephant") || r.includes("หูช้าง")) {
      groupEN = "Dumbo Elephant Ear";
      groupTH = "หูช้าง";
    }

    // ⭐ 3. CROWNTAIL (ต้องไม่ใช่ wild)
    else if (m.includes("crowntail") && !m.includes("wild")) {
      groupEN = "Crowntail";
      groupTH = "คราวน์เทล";
    }

    // ⭐ 4. HALFMOON
    else if (m.includes("halfmoon")) {
      groupEN = "Halfmoon";
      groupTH = "ฮาฟมูน";
    }

    // ⭐ 5. PLAKAT
    else if (m.includes("short")) {
      groupEN = "Plakat";
      groupTH = "ปลากัดครีบสั้น";
    }

    if (groupEN) {
      data.betta_group = `${groupEN} (${groupTH})`;
    }

    /**
     * =====================================================
     * ⭐ MORPHOLOGY ENHANCEMENT (DUMBO FIX)
     * =====================================================
     */
    if (m.includes("elephant") || r.includes("หูช้าง")) {
      data.morphology =
        (data.morphology || "") + " Elephant Ear Dumbo";
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
     * ⭐ COMBINE TH + EN DISPLAY
     * =====================================================
     */
    if (data.breed_estimate && data.breed_estimate_th) {
      data.breed_estimate =
        `${data.breed_estimate} (${data.breed_estimate_th})`;
    }

    console.log("✅ GOD ENGINE V12 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD ENGINE V12 ERROR:", err);
    throw err;
  }
}