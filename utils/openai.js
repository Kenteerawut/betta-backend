import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧠 GOD ENGINE V19 — SAFE LOCK
 * ✔ Betta Guard Level 2
 * ✔ Wild Hard Lock
 * ✔ JSON Safe Parse
 * ✔ Anti Off-topic
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE V19 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * =====================================================
     * PASS 0 — BETTA ONLY GUARD (LEVEL 2)
     * =====================================================
     */
    const bettaCheck = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือ AI ตรวจสอบปลากัด

กฎ:
- ดูเฉพาะภาพ
- ถ้าไม่ใช่ Betta ให้ตอบ NOT_BETTA
- ถ้าใช่ Betta ให้ตอบ BETTA

TEXT ONLY
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

    const bettaType =
      bettaCheck.output?.[0]?.content?.[0]?.text ||
      bettaCheck.output_text ||
      "";

    console.log("🧪 BETTA CHECK =", bettaType);

    if (!bettaType.toLowerCase().includes("betta")) {
      return {
        status: "not_supported",
        breed_estimate: "Not Betta",
        betta_group: "Unknown",
        short_reason: "ระบบรองรับเฉพาะปลากัดเท่านั้น",
        morphology: "Unknown",
        confidence: 100,
      };
    }

    /**
     * =====================================================
     * PASS 1 — HARD WILD LOCK
     * =====================================================
     */
    const wildCheck = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือผู้เชี่ยวชาญ Wild Betta

กฎ:
- Wild = ลำตัวเรียวยาว ครีบไม่ 180 ไม่มี web reduction
- Fancy = เฉพาะประกวดจริง

ตอบ ONLY:
WILD
หรือ
FANCY
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

    const wildType =
      wildCheck.output?.[0]?.content?.[0]?.text ||
      wildCheck.output_text ||
      "";

    console.log("🧪 WILD CHECK =", wildType);

    if (wildType.toLowerCase().includes("wild")) {
      return {
        status: "success",
        breed_estimate: "Wild Betta",
        breed_estimate_th: "ปลากัดป่า",
        betta_group: "Wild Betta (ปลากัดป่า)",
        short_reason:
          "ตรวจพบลักษณะ Wild Form — ระบบล็อกไม่ให้วิเคราะห์สายประกวด",
        morphology: "Wild Body",
        confidence: 95,
      };
    }

    /**
     * =====================================================
     * PASS 2 — MORPHOLOGY STRICT
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
ตรวจ morphology ปลากัดอย่างเข้มงวด

Halfmoon = ต้อง 180 องศาจริง
Crowntail = ต้องมี spine จริง
Dumbo = ครีบอกใหญ่จริง

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
     * PASS 3 — FINAL JUDGE (STRICT JSON)
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
คุณคือกรรมการปลากัดระดับประกวด

Morphology = ${morph}

กฎ:
- ห้ามเดา
- ห้ามตอบเรื่องอื่น
- ตอบ JSON เท่านั้น

{
 "status":"success",
 "breed_estimate":"",
 "breed_estimate_th":"",
 "betta_group":"",
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

    let data = {};
    try {
      let text =
        res.output?.[0]?.content?.[0]?.text ||
        res.output_text ||
        "{}";

      text = text.replace(/```json/gi, "").replace(/```/g, "").trim();
      data = JSON.parse(text);
    } catch {
      data = { status: "parse_error" };
    }

    data.morphology = morph;

    /**
     * GROUP PRIORITY FIX
     */
    const m = morph.toLowerCase();

    if (m.includes("crowntail")) {
      data.betta_group = "Crowntail (คราวน์เทล)";
    } else if (m.includes("halfmoon")) {
      data.betta_group = "Halfmoon (ฮาฟมูน)";
    } else if (m.includes("short")) {
      data.betta_group = "Plakat (ปลากัดครีบสั้น)";
    }

    /**
     * CONFIDENCE NORMALIZE
     */
    let conf = data.confidence ?? 75;
    if (conf <= 1) conf = Math.round(conf * 100);
    if (conf > 100) conf = 90;
    data.confidence = conf;

    console.log("✅ GOD ENGINE V19 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD ENGINE V19 ERROR:", err);
    throw err;
  }
}