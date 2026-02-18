import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
  question = "",
}) {
  try {
    console.log("🔥 THAI BETTA PRO ANALYZE START");

    // ❌ ของเดิมคุณไม่ได้ครอบ string
    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    const res = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text:
                question ||
                `
คุณคือผู้เชี่ยวชาญปลากัดระดับโลกที่เชี่ยวชาญปลากัดไทยโดยเฉพาะ

วิเคราะห์ปลากัดจากภาพ โดยต้องใช้หลักการจำแนกสายพันธุ์แบบวงการปลากัดไทย
และตอบเป็น JSON เท่านั้น ห้ามมี \`\`\`json หรือข้อความอื่น

==========================
กฎการวิเคราะห์ (สำคัญมาก)
==========================

1️⃣ ให้แยก "กลุ่มหลัก" ก่อน:
- ปลากัดป่า (Wild Betta)
- ปลากัดหม้อ
- ปลากัดจีน
- ปลากัดแฟนซี
- Alien / Galaxy
- Plakat
- Halfmoon
- Crowntail
- Double Tail

2️⃣ กฎลดการทายมั่ว:

- ถ้าครีบสั้น + ลำตัวทรงปลาป่า + ลายเมทัลลิค galaxy
👉 ให้พิจารณา Alien / Wild Hybrid ก่อน Fancy

- ถ้าครีบแหลมเป็นหนามชัด
👉 Crowntail เท่านั้น

- ถ้าครีบสั้นกลม ไม่แผ่ 180°
👉 Plakat

- ถ้าครีบยาวแผ่ครึ่งวงกลม
👉 Halfmoon

3️⃣ ห้ามเดาสายพันธุ์ถ้าไม่มั่นใจ
ให้ตอบว่า "ไม่สามารถระบุชัดเจน"

4️⃣ ต้องมีค่าความมั่นใจ (0-100)
ถ้าลักษณะไม่ชัด ห้ามเกิน 70%

==========================
รูปแบบ JSON ที่ต้องตอบ
==========================

{
  "main_species_th": "",
  "main_species_en": "",
  "subtype": "",
  "color_traits": "",
  "grade": "",
  "confidence": 0,
  "analysis": ""
}
`,
            },
            {
              type: "input_image",
              image_url: imageDataUrl,
            },
          ],
        },
      ],
    });

    // ป้องกัน undefined
    let text = res.output_text ?? "";

    // กัน markdown fence
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const data = JSON.parse(text);

    console.log("✅ THAI BETTA JSON =", data);

    return data;
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
}
