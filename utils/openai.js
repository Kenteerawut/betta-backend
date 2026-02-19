import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 BETTA AI V5 ULTRA FINAL
 * FINAL JUDGE ENGINE — Academic Stable Version
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 BETTA V5 ULTRA FINAL START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    const res = await openai.responses.create({
      model: "gpt-4.1-mini",

      input: [
        {
          role: "system",
          content: [
            {
              type: "input_text",
              text: `
คุณคือ Betta Taxonomy Judge Engine (ULTRA FINAL)

ให้วิเคราะห์ปลากัดแบบวิชาการ โดยแยกเป็น 3 Layer

==========================
LAYER 1 — MAIN SPECIES
==========================
เลือกได้เท่านั้น:

- ปลากัดป่า (Wild Betta)
- ปลากัดหม้อ (Plakat Thai)
- ปลากัดจีน (Chinese Betta)
- ปลากัดแฟนซี (Fancy Betta)
- ไม่สามารถระบุได้

กฎสำคัญ:
- ถ้าลำตัวเรียว dorsal เล็ก → Wild Betta
- ห้ามจัด Wild เป็น Fancy

==========================
LAYER 2 — TAIL TYPE
==========================
- Halfmoon
- Crowntail
- Plakat
- Doubletail
- Veiltail
- Wild Form

ห้ามเอา tail type ไปเป็นสายพันธุ์

==========================
LAYER 3 — SPECIAL TRAIT
==========================
ตรวจสอบครีบอก:

ถ้าครีบอกใหญ่ผิดปกติ
ให้ special_trait_en = "Dumbo Ear"

เลือกได้:
- Dumbo Ear
- Giant
- Alien
- Metallic
- None

==========================
กฎการวิเคราะห์
==========================
1) Morphology > Tail > Trait > Color
2) ห้ามใช้คำว่า Fancy ถ้ามีโครงสร้าง Wild ชัด
3) ถ้าไม่มั่นใจให้ confidence ไม่เกิน 70

ตอบ JSON เท่านั้น:

{
"main_species_th":"",
"main_species_en":"",
"tail_type_en":"",
"special_trait_en":"",
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
          content: [
            {
              type: "input_image",
              image_url: imageDataUrl,
            },
          ],
        },
      ],
    });

    // ⭐ SAFE PARSE (กัน Railway crash)
    let text = res.output_text || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    /**
     * 🛡️ SAFETY ENGINE
     * กัน confidence เพี้ยน
     */
    if (!data.confidence_score || data.confidence_score < 30) {
      data.confidence_score = 68;
    }

    /**
     * 🛡️ WILD LOCK
     */
    if (
      data.tail_type_en === "Wild Form" &&
      data.main_species_en === "Fancy Betta"
    ) {
      data.main_species_th = "ปลากัดป่า";
      data.main_species_en = "Wild Betta";
    }

    console.log("✅ BETTA V5 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 V5 ULTRA FINAL ERROR:", err);
    throw err;
  }
}
