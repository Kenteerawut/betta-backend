import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * MAP ภาษาไทย (Educational Mode)
 */
const tailMapTH = {
  Halfmoon: "หางครึ่งวงกลม",
  Crowntail: "หางมงกุฎ",
  Plakat: "หางสั้น",
  Doubletail: "หางคู่",
  "Wild Form": "ทรงป่า",
  Unknown: "ไม่ทราบ",
};

const traitMapTH = {
  "Dumbo Ear": "หูช้าง",
  Giant: "ปลากัดยักษ์",
  Normal: "ปกติ",
};

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 THAI BETTA ACADEMIC MODE START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * ==========================
     * STEP 1 — MORPHOLOGY CLASSIFIER
     * ==========================
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

เลือกได้:
Plakat
Halfmoon
Crowntail
Doubletail
Wild Form
Unknown

ตอบ TEXT อย่างเดียว
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

    const tailTypeEN = (classify.output_text ?? "Unknown").trim();

    console.log("🐟 tail_type =", tailTypeEN);

    /**
     * ==========================
     * STEP 2 — TAXONOMY ANALYZER (ACADEMIC LOCK)
     * ==========================
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
คุณคือผู้เชี่ยวชาญปลากัดไทย

❌ ห้ามใช้คำว่า Thai Betta
❌ ห้ามตอบภาษาอังกฤษ

สายพันธุ์หลักที่อนุญาต:

ปลากัดหม้อ
ปลากัดจีน
ปลากัดมหาชัย
ปลากัดป่า
ไม่สามารถระบุได้

คำว่า "ปลากัดประกวด" เป็นหมวดการเลี้ยง
ห้ามใส่ใน main_species_th

tail_type คือ ${tailTypeEN}

การให้เกรด:

High Grade = โครงสร้างสมดุล ครีบสมบูรณ์ สีสม่ำเสมอ
Medium Grade = รูปทรงดีแต่มีจุดด้อยเล็กน้อย
Low Grade = โครงสร้างยังไม่สมบูรณ์

ตอบ JSON เท่านั้น:

{
"main_species_th":"",
"main_species_en":"",
"breed_category_th":"",
"breed_category_en":"",
"special_trait_en":"",
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
     * SAFE PARSE (กัน Railway 500)
     */
    let text = res.output_text ?? "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let data = JSON.parse(text);

    /**
     * ==========================
     * เติมภาษาไทย (วงเล็บ)
     * ==========================
     */
    data.tail_type_en = tailTypeEN;
    data.tail_type_th = tailMapTH[tailTypeEN] || "ไม่ทราบ";

    data.special_trait_th =
      traitMapTH[data.special_trait_en] || "ไม่ระบุ";

    /**
     * ==========================
     * เติมคำอธิบายเกรด
     * ==========================
     */
    if (data.grade === "High Grade") {
      data.grade =
        "High Grade — โครงสร้างสมดุล ครีบสมบูรณ์ สีสม่ำเสมอ";
    } else if (data.grade === "Medium Grade") {
      data.grade =
        "Medium Grade — รูปทรงดีแต่มีจุดด้อยเล็กน้อย";
    } else if (data.grade === "Low Grade") {
      data.grade =
        "Low Grade — โครงสร้างยังไม่สมบูรณ์";
    }

    if (!data.confidence_score || data.confidence_score < 25) {
      data.confidence_score = 70;
    }

    console.log("✅ ACADEMIC MODE RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 ACADEMIC MODE ERROR:", err);
    throw err;
  }
}
