import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🔥 GOD ENGINE V16 — BETTA LOCK MODE
 * - วิเคราะห์เฉพาะ Betta splendens
 * - Block Wild / Goldfish / Fish อื่น
 * - Lock Prompt ให้ตอบเฉพาะปลากัด
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE V16 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * =====================================================
     * PASS 1 — BETTA SPECIES LOCK
     * =====================================================
     */
    const speciesCheck = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{
            type: "input_text",
            text: `
คุณคือ Betta Species Gate

ตรวจว่าเป็น Betta splendens หรือไม่

ตอบ ONLY:
BETTA
หรือ
NOT_BETTA
`
          }]
        },
        {
          role: "user",
          content: [{ type: "input_image", image_url: imageDataUrl }]
        }
      ]
    });

    const species =
      speciesCheck.output?.[0]?.content?.[0]?.text ||
      speciesCheck.output_text ||
      "";

    console.log("🐟 SPECIES =", species);

    if (!species.toLowerCase().includes("betta")) {
      return {
        status: "blocked",
        breed_estimate: "Not Betta Fish",
        betta_group: "Unknown",
        short_reason: "ระบบอนุญาตเฉพาะปลากัดเท่านั้น",
        confidence: 100
      };
    }

    /**
     * =====================================================
     * PASS 2 — MORPHOLOGY SCAN
     * =====================================================
     */
    const morphRes = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{
            type: "input_text",
            text: `
ตรวจ Morphology ของ Fancy Betta เท่านั้น

ตรวจ:
Halfmoon / Plakat / Crowntail / Dumbo / Double Tail / Rosetail

ห้ามตอบ Wild
ตอบ TEXT ONLY
`
          }]
        },
        {
          role: "user",
          content: [{ type: "input_image", image_url: imageDataUrl }]
        }
      ]
    });

    const morph =
      morphRes.output?.[0]?.content?.[0]?.text ||
      morphRes.output_text ||
      "Unknown";

    console.log("🧬 MORPH =", morph);

    /**
     * =====================================================
     * PASS 3 — GOD JUDGE (BETTA LOCK PROMPT)
     * =====================================================
     */
    const result = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{
            type: "input_text",
            text: `
SYSTEM ROLE:
คุณคือกรรมการ Fancy Betta ระดับประกวด

ข้อห้าม:
- ห้ามตอบ Wild Betta
- ห้ามพูดถึงปลาอื่น
- ถ้าไม่ชัด ให้ตอบ Long Fin Betta

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
`
          }]
        },
        {
          role: "user",
          content: [{ type: "input_image", image_url: imageDataUrl }]
        }
      ]
    });

    let data = {};

    try {
      let text =
        result.output?.[0]?.content?.[0]?.text ||
        result.output_text ||
        "{}";

      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      data = JSON.parse(text);
    } catch {
      data = { status: "parse_error" };
    }

    /**
     * =====================================================
     * 🧠 BETTA GROUP LOCK
     * =====================================================
     */
    const m = (morph || "").toLowerCase();

    let groupEN = "Long Fin Betta";
    let groupTH = "ปลากัดครีบยาว";

    if (m.includes("crowntail")) {
      groupEN = "Crowntail";
      groupTH = "คราวน์เทล";
    } else if (m.includes("halfmoon")) {
      groupEN = "Halfmoon";
      groupTH = "ฮาฟมูน";
    } else if (m.includes("short")) {
      groupEN = "Plakat";
      groupTH = "ปลากัดครีบสั้น";
    } else if (m.includes("elephant")) {
      groupEN = "Dumbo Elephant Ear";
      groupTH = "หูช้าง";
    }

    data.betta_group = `${groupEN} (${groupTH})`;
    data.morphology = morph;

    /**
     * =====================================================
     * CONFIDENCE NORMALIZE
     * =====================================================
     */
    let conf = data.confidence ?? 70;

    if (typeof conf === "number") {
      if (conf <= 1) conf = Math.round(conf * 100);
      else conf = Math.round(conf);
    }

    data.confidence = conf;

    console.log("✅ GOD ENGINE V16 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD ENGINE V16 ERROR:", err);
    throw err;
  }
}