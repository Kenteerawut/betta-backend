import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

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
    console.log("🔥 THAI BETTA PRO MAX V6 HOTFIX START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * STEP 1 — CLASSIFY TAIL
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
          content: [
            {
              type: "input_image",
              image_url: imageDataUrl,
            },
          ],
        },
      ],
    });

    const tailTypeEN = (classify.output_text ?? "Unknown").trim();

    console.log("🐟 tail_type =", tailTypeEN);

    /**
     * STEP 2 — ANALYZE (SAFE MODE)
     * 🔥 ตัด json_schema ออก เพราะ Railway ยัง parse ไม่ได้
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
คุณคือ Thai Betta Specialist

tail_type คือ: ${tailTypeEN}

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
     * ⭐ SAFE PARSE (ไม่พัง Railway)
     */
    let text = res.output_text ?? "";
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    let data;

    try {
      data = JSON.parse(text);
    } catch (e) {
      console.error("❌ JSON PARSE FAIL =", text);
      throw e;
    }

    /**
     * EDUCATIONAL MODE
     */
    data.tail_type_en = tailTypeEN;
    data.tail_type_th = tailMapTH[tailTypeEN] || "ไม่ทราบ";
    data.special_trait_th =
      traitMapTH[data.special_trait_en] || "ไม่ระบุ";

    if (!data.confidence_score || data.confidence_score < 25) {
      data.confidence_score = 70;
    }

    console.log("✅ PRO MAX V6 RESULT =", data);

    return data;
  } catch (err) {
    console.error("🔥 PRO MAX V6 ERROR:", err);
    throw err;
  }
}
