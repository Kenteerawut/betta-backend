import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧠 GOD ENGINE V21 — FULL STEP LOGIC
 * ✔ Strict Betta Guard
 * ✔ STEP -1 → STEP 4 Morphology Flow
 * ✔ ไม่มี fallback group
 * ✔ เสถียรสำหรับพรีเซน
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE V21 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ============================
     * PASS 0 — BETTA GUARD (STRICT)
     * ============================
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
คุณคือระบบตรวจสอบภาพ
ดูเฉพาะภาพ

ตอบได้แค่คำเดียว:
BETTA
หรือ
NOT_BETTA

ห้ามมีคำอื่น
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

    const normalized = bettaType.trim().toUpperCase();

    console.log("🧪 BETTA CHECK =", normalized);

    // ✅ STRICT MATCH (แก้ bug includes)
    if (normalized !== "BETTA") {
      return {
        status: "not_supported",
        breed_estimate: "Not Betta",
        breed_estimate_th: "ไม่ใช่ปลากัด",
        betta_group: "Unknown",
        morphology: "Unknown",
        short_reason: "ระบบรองรับเฉพาะปลากัด",
        confidence: 100,
      };
    }

    /**
     * ============================
     * FINAL BREEDER ANALYSIS — FULL STEP FLOW
     * ============================
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
คุณคือกรรมการประกวดปลากัดระดับมืออาชีพ

วิเคราะห์ตามลำดับ STEP เท่านั้น

========================
STEP -1 : BETTA DETECTION
========================
ตรวจว่าภาพเป็นปลากัดจริง (ผ่านแล้ว)

========================
STEP 0 : TYPE CLASSIFICATION
========================
แยกว่าเป็น:

Wild Betta:
- ลำตัวเรียว
- ครีบธรรมชาติ
- ไม่กาง 180°

Ornamental (Fancy):
- หางใหญ่
- ฟอร์มประกวด

========================
STEP 1 : TAIL STRUCTURE
========================
- Over Halfmoon > 180°
- Halfmoon ≈ 180°
- Super Delta กางกว้างแต่ไม่ถึง 180°
- Delta กางระดับกลาง

========================
STEP 2 : RAY / SPINE STRUCTURE
========================
Crowntail ต้องมี:
- ก้านครีบยื่นจริง (spine)
- ช่องว่างระหว่าง ray

ถ้าเห็นแค่ texture ห้ามเรียก Crowntail

========================
STEP 3 : FIN LENGTH
========================
- Plakat = ครีบสั้น
- Longfin = ครีบยาว

========================
STEP 4 : SPECIAL TRAITS
========================
- Dumbo / Elephant Ear = ครีบอกใหญ่
- Double Tail = หางแยกสองแฉก
- Rosetail = branching หนา

IMPORTANT:
- ห้ามเดาจากสี
- ถ้าไม่มั่นใจใช้ Unknown
- วิเคราะห์ตาม STEP เท่านั้น

ตอบ JSON เท่านั้น:

{
 "status":"success",
 "type":"Ornamental | Wild | Unknown",
 "breed_estimate":"",
 "breed_estimate_th":"",
 "betta_group":"",
 "short_reason":"",
 "morphology":"",
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

    /**
     * ============================
     * CONFIDENCE NORMALIZE ONLY
     * ============================
     */
    let conf = data.confidence ?? 70;
    if (conf <= 1) conf = Math.round(conf * 100);
    if (conf > 100) conf = 95;
    data.confidence = conf;

    console.log("✅ GOD ENGINE V21 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 GOD ENGINE V21 ERROR:", err);
    throw err;
  }
}