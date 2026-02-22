import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA GOD ENGINE V11 — FREE BREED JUDGE
 * วิเคราะห์ได้ทุกสายพันธุ์ (ไม่ล็อกผลลัพธ์)
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 BETTA GOD V11 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ===============================
     * PASS 1 — MORPHOLOGY SCAN
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
คุณคือ Morphology Scanner

ตรวจเฉพาะโครงสร้าง:
Wild Body
Long Fin
Short Fin
Crowntail Spine
Halfmoon Spread

ตอบ TEXT สั้นที่สุด
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
     * PASS 2 — EXPERT BREEDER MODE
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
คุณคือกรรมการประกวดปลากัด

Morphology = ${morph}

กฎสำคัญ:

- วิเคราะห์อิสระ ห้ามยึดสายพันธุ์เดิม
- ถ้าไม่ใช่ Halfmoon ห้ามเรียก Halfmoon
- ใช้เหตุผลจาก:
  tail spread
  fin length
  spine
  pattern
  color

Candidate Breed Pool:

Halfmoon
Over Halfmoon
Crowntail
Super Delta
Delta
Veiltail
Plakat
Halfmoon Plakat
Koi
Fancy
Marble
Dumbo Ear
Rosetail
Feathertail
Wild Betta

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
     * 🧠 GOD JUDGE — SMART ADJUST
     * ===============================
     */

    data.morphology = morph;

    // ❗ ไม่ override group อีกแล้ว
    // ปล่อยให้ AI ตัดสินจริง

    /**
     * ===============================
     * CONFIDENCE NORMALIZE
     * ===============================
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
     * ===============================
     * COMBINE TH + EN
     * ===============================
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