import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD JUDGE THAI PRO+ START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * =========================
     * PASS 1 — MORPHOLOGY
     * =========================
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

    /**
     * =========================
     * PASS 2 — GOD JUDGE THAI PRO+
     * =========================
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
คุณคือ AI กรรมการวิเคราะห์ปลากัดมืออาชีพ

Morphology = ${morph}

กฎ:
- ตอบภาษาไทยเป็นหลัก
- สายพันธุ์ต้องมี อังกฤษ + ไทย ในวงเล็บ
- กลุ่มต้องมี อังกฤษ + ไทย ในวงเล็บ
- confidence ต้องอยู่ระหว่าง 0.0 ถึง 1.0 เท่านั้น
- ห้ามใส่ %

ตอบ JSON ONLY:

{
  "status":"success",
  "betta_group":"",
  "betta_group_th":"",
  "breed_estimate":"",
  "breed_estimate_th":"",
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
     * =========================
     * SAFE JSON PARSER
     * =========================
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
     * =========================
     * 🧠 GOD JUDGE ENGINE
     * =========================
     */

    data.morphology = morph;

    if (morph.includes("Wild")) {
      data.betta_group = "WILD";
      data.betta_group_th = "สายป่า";
    }

    /**
     * ⭐ รวมไทย+อังกฤษ
     */
    if (data.breed_estimate && data.breed_estimate_th) {
      data.breed_estimate =
        `${data.breed_estimate} (${data.breed_estimate_th})`;
    }

    if (data.betta_group && data.betta_group_th) {
      data.betta_group =
        `${data.betta_group} (${data.betta_group_th})`;
    }

    /**
     * ⭐ Normalize Confidence (กัน 9500%)
     */
    if (typeof data.confidence === "number") {
      if (data.confidence <= 1) {
        data.confidence = Number(data.confidence.toFixed(2));
      } else {
        data.confidence = 0.68;
      }
    } else {
      data.confidence = 0.68;
    }

    console.log("✅ GOD JUDGE THAI PRO+ RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD JUDGE ERROR:", err);
    throw err;
  }
}