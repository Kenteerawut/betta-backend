import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA GOD ENGINE V13 — FINAL PRESENTATION VERSION
 * ✔ Wild lock จริง
 * ✔ Dumbo detect จริง
 * ✔ Crowntail ไม่ override Wild
 * ✔ Decision Tree จริงแบบ breeder
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE V13 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ===============================
     * PASS 1 — STRUCTURE DETECTOR
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
คุณคือ Morphology Detector ปลากัดระดับประกวด

ตรวจหา:
Wild Body
Long Fin
Short Fin Plakat
Halfmoon Spread 180 Degree
Crowntail Spine (web reduction)
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
     * ===============================
     * PASS 2 — EXPERT JUDGE
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
คุณคือกรรมการปลากัดระดับประกวด

วิเคราะห์ตาม breeder logic:
- Wild body สำคัญที่สุด
- Dumbo = ครีบอกใหญ่
- Crowntail = web reduction จริง
- Halfmoon = 180 degree
- Plakat = ครีบสั้น

Morphology = ${morph}

ตอบ JSON ONLY:

{
 "status":"success",
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
     * ===============================
     * SAFE JSON PARSER
     * ===============================
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
     * ===============================
     * 🧠 FINAL DECISION TREE (ของจริง)
     * ===============================
     */

    data.morphology = morph;

    const m = (morph || "").toLowerCase();
    const r = (data.short_reason || "").toLowerCase();

    let groupEN = "Unknown";
    let groupTH = "ไม่ทราบ";

    /**
     * PRIORITY จริง:
     * Wild > Dumbo > Crowntail > Halfmoon > Plakat
     */

    // ⭐ WILD BODY FIRST
    if (m.includes("wild")) {
      groupEN = "Wild Betta";
      groupTH = "ปลากัดป่า";
    }

    // ⭐ DUMBO (หูช้าง)
    else if (m.includes("elephant") || r.includes("หูช้าง")) {
      groupEN = "Dumbo Elephant Ear";
      groupTH = "หูช้าง";
    }

    // ⭐ CROWNTAIL (ต้องไม่ใช่ wild)
    else if (m.includes("crowntail") && !m.includes("wild")) {
      groupEN = "Crowntail";
      groupTH = "คราวน์เทล";
    }

    // ⭐ HALFMOON
    else if (m.includes("halfmoon")) {
      groupEN = "Halfmoon";
      groupTH = "ฮาฟมูน";
    }

    // ⭐ PLAKAT
    else if (m.includes("short")) {
      groupEN = "Plakat";
      groupTH = "ปลากัดครีบสั้น";
    }

    data.betta_group = `${groupEN} (${groupTH})`;

    /**
     * ⭐ MORPHOLOGY ENHANCE (DUMBO FIX)
     */
    if (m.includes("elephant") || r.includes("หูช้าง")) {
      data.morphology =
        (data.morphology || "") + " Elephant Ear Dumbo";
    }

    /**
     * ⭐ CONFIDENCE NORMALIZE
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
     * ⭐ TH + EN DISPLAY
     */
    if (data.breed_estimate && data.breed_estimate_th) {
      data.breed_estimate =
        `${data.breed_estimate} (${data.breed_estimate_th})`;
    }

    console.log("✅ GOD ENGINE V13 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD ENGINE V13 ERROR:", err);
    throw err;
  }
}