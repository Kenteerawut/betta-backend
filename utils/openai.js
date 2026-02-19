import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * ⭐ BETTA SPECIES-LEVEL ANALYZER (Morphology Brain)
 */
export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 SPECIES LEVEL ANALYZE START");

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
คุณคือผู้เพาะปลากัดไทยระดับมืออาชีพ และนักจำแนกสายพันธุ์ปลากัด

ให้วิเคราะห์ปลากัดจากภาพด้วย Morphology จริง
ต้องคิดแบบคนวงการ ไม่ใช่ classifier ธรรมดา

========================
ขั้นตอนการวิเคราะห์
========================

STEP 1 — โครงสร้างลำตัว
- ลำตัวหนา ครีบใหญ่ → Domestic Betta
- ลำตัวเรียว → Wild-form

STEP 2 — รูปทรงหาง
- Plakat = ครีบสั้น
- Halfmoon = กาง 180°
- Crowntail = หนามแหลม
- Veiltail = ครีบยาวตก

STEP 3 — ลายเกล็ดและสี
- turquoise galaxy → Alien / Wild Hybrid
- สีพื้นธรรมชาติ → Wild Betta
- metallic หนา → Fancy Domestic

========================
สายพันธุ์ที่อนุญาตให้เลือก
========================

ปลากัดหม้อสายสวยงาม (Plakat Fancy)
ปลากัดประกวด (Show Plakat)
ปลากัดจีน (Veiltail Betta)
ปลากัดหางมงกุฎ (Crowntail Betta)
ปลากัดฮาล์ฟมูน (Halfmoon Betta)
ปลากัดยักษ์ (Giant Betta)
ปลากัดหูช้าง (Dumbo Ear Betta)
ปลากัดทรงป่า (Wild-form Betta)
ปลากัดมหาชัย (Mahachai Betta)
ปลากัดอิมเบลลิส (Imbellis Betta)
ปลากัดสมาเรกดินา (Smaragdina Betta)
Alien Betta
ไม่สามารถระบุได้

========================
กฎสำคัญ
========================

- ห้ามเลือก Domestic ถ้าลำตัวเรียวทรงป่า
- ห้ามเลือก Mahachai ถ้าไม่มีลักษณะเฉพาะ
- ต้องอธิบาย reasoning แบบผู้เพาะปลา
- analysis ต้องเขียนภาษาไทย

========================
ตอบ JSON เท่านั้น
========================

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
          content: [
            {
              type: "input_image",
              image_url: imageDataUrl,
            },
          ],
        },
      ],
    });

    /**
     * ⭐ SAFE PARSE
     */
    let text = res.output_text || "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    /**
     * ⭐ CONFIDENCE NORMALIZE
     */
    data.confidence_score = Number(data.confidence_score);

    if (!data.confidence_score || data.confidence_score < 40) {
      data.confidence_score = 65;
    }

    if (data.confidence_score > 95) {
      data.confidence_score = 90;
    }

    console.log("✅ SPECIES RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
}
