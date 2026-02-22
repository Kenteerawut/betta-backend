import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 GOD ENGINE V18 — BREEDER SAFE MODE
 * FIX:
 * - Stop hallucinated Crowntail
 * - Stop Fake Dumbo
 * - Halfmoon needs 180°
 * - Morphology becomes HARD RULE
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE V18 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ============================
     * PASS 0 — BETTA CHECK
     * ============================
     */
    const bettaCheck = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: `ตรวจว่าเป็นปลากัดหรือไม่ ตอบ BETTA หรือ NOT_BETTA` }],
        },
        {
          role: "user",
          content: [{ type: "input_image", image_url: imageDataUrl }],
        },
      ],
    });

    const bettaType =
      bettaCheck.output?.[0]?.content?.[0]?.text ||
      bettaCheck.output_text ||
      "";

    if (!bettaType.toLowerCase().includes("betta")) {
      return {
        status: "not_supported",
        breed_estimate: "Not Betta",
        betta_group: "Unknown",
        short_reason: "ระบบรองรับเฉพาะปลากัด",
        confidence: 100,
      };
    }

    /**
     * ============================
     * PASS 1 — WILD DETECTOR
     * ============================
     */
    const wildCheck = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{ type: "input_text", text: `Wild หรือ Fancy เท่านั้น ตอบ WILD หรือ FANCY` }],
        },
        {
          role: "user",
          content: [{ type: "input_image", image_url: imageDataUrl }],
        },
      ],
    });

    const wildType =
      wildCheck.output?.[0]?.content?.[0]?.text ||
      wildCheck.output_text ||
      "";

    if (wildType.toLowerCase().includes("wild")) {
      return {
        status: "success",
        breed_estimate: "Wild Betta",
        breed_estimate_th: "ปลากัดป่า",
        betta_group: "Wild Betta",
        morphology: "Wild Body",
        confidence: 95,
      };
    }

    /**
     * ============================
     * PASS 2 — MORPHOLOGY SCAN
     * ============================
     */

    const classify = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{
            type: "input_text",
            text: `
ตรวจ morphology เท่านั้น ห้ามตั้งสายพันธุ์

ให้ตอบคำเหล่านี้เท่านั้น:
LONG_FIN
HALFMOON_180
CROWNTAIL_WEB_REDUCTION
DUMBO_PECTORAL
PLAKAT_SHORT
UNKNOWN
`,
          }],
        },
        {
          role: "user",
          content: [{ type: "input_image", image_url: imageDataUrl }],
        },
      ],
    });

    let morph =
      classify.output?.[0]?.content?.[0]?.text ||
      classify.output_text ||
      "UNKNOWN";

    morph = morph.toUpperCase();

    console.log("🧬 MORPH =", morph);

    /**
     * ============================
     * 🔒 HARD RULE GROUP DECISION
     * ============================
     */

    let group = "Unknown";
    let breed = "Betta splendens";

    if (morph.includes("CROWNTAIL_WEB_REDUCTION")) {
      group = "Crowntail (คราวน์เทล)";
    }
    else if (morph.includes("HALFMOON_180")) {
      group = "Halfmoon (ฮาฟมูน)";
    }
    else if (morph.includes("PLAKAT_SHORT")) {
      group = "Plakat (ปลากัดครีบสั้น)";
    }
    else if (morph.includes("LONG_FIN")) {
      group = "Long Fin Betta";
    }

    /**
     * ============================
     * DUMBO ADDON ONLY
     * ============================
     */
    if (morph.includes("DUMBO_PECTORAL")) {
      group += " + Dumbo";
    }

    /**
     * ============================
     * CONFIDENCE LOGIC
     * ============================
     */
    let confidence = 85;

    if (morph.includes("UNKNOWN")) confidence = 70;
    if (morph.includes("HALFMOON_180")) confidence = 95;
    if (morph.includes("CROWNTAIL_WEB_REDUCTION")) confidence = 95;

    const result = {
      status: "success",
      breed_estimate: breed,
      betta_group: group,
      morphology: morph,
      short_reason: "วิเคราะห์จากโครงสร้างครีบและ morphology จริง",
      confidence,
    };

    console.log("✅ GOD ENGINE V18 RESULT =", result);

    return result;
  } catch (err) {
    console.error("🔥 GOD ENGINE V18 ERROR:", err);
    throw err;
  }
}