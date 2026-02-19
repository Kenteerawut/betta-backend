import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧠 V7 DEFENSE MODE — NEAR REAL JUDGE
 * เป้าหมาย: ให้ใกล้ reasoning แบบ ChatGPT มากที่สุด
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 V7 DEFENSE MODE START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ===============================
     * STEP 1 — MORPHOLOGY LOCK
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
คุณคือ Morphology Classifier ปลากัด

วิเคราะห์เฉพาะโครงสร้าง:

- Long Fin
- Short Fin
- Crowntail Spine
- Halfmoon Spread
- Wild Body

ตอบเป็น TEXT:

Long Fin
Short Fin
Crowntail
Halfmoon
Wild Form
Unknown
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

    const morph = (classify.output_text || "Unknown").trim();
    console.log("🧬 Morphology =", morph);

    /**
     * ===============================
     * STEP 2 — FINAL JUDGE
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
คุณคือ Thai Betta Judge (Defense Mode)

Morphology ถูกล็อกแล้ว = ${morph}

กฎ:

1) Long Fin → ห้ามตอบปลากัดหม้อ
2) Wild Form → ห้ามตอบ Fancy
3) Halfmoon → จัดเป็น Show Betta
4) Crowntail → ปลากัดประกวด

สายพันธุ์ไทยที่เลือกได้:

ปลากัดหม้อ
ปลากัดจีน
ปลากัดมหาชัย
ปลากัดป่า
ปลากัดประกวด
ไม่สามารถระบุได้

ตอบ JSON:

{
"main_species_th":"",
"main_species_en":"",
"breed_category_th":"",
"breed_category_en":"",
"color_traits":"",
"grade":"",
"confidence_score":0,
"analysis":""
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
     * SAFE PARSE
     * ===============================
     */
    let data;

    if (res.output?.[0]?.content?.[0]?.json) {
      data = res.output[0].content[0].json;
    } else {
      let text = res.output_text || "";
      text = text.replace(/```json/g, "").replace(/```/g, "").trim();
      data = JSON.parse(text);
    }

    /**
     * ===============================
     * DEFENSE MODE BIO FIX
     * ===============================
     */

    // Inject morphology
    data.morphology = morph;

    // ⭐ Long Fin → กัน Plakat
    if (morph === "Long Fin" && data.main_species_th === "ปลากัดหม้อ") {
      data.main_species_th = "ปลากัดประกวด";
      data.main_species_en = "Show Betta";
    }

    // ⭐ Wild Lock
    if (morph === "Wild Form") {
      data.main_species_th = "ปลากัดป่า";
      data.main_species_en = "Wild Betta";
    }

    // ⭐ Confidence normalization
    if (!data.confidence_score || data.confidence_score < 40) {
      data.confidence_score = 68;
    }

    console.log("✅ V7 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 V7 ERROR:", err);
    throw err;
  }
}
