import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * วิเคราะห์รูปปลากัด
 */
export async function analyzeBettaImage(base64Image) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "คุณคือผู้เชี่ยวชาญปลากัด วิเคราะห์เฉพาะเรื่องปลากัดเท่านั้น",
      },
      {
        role: "user",
        content: [
          {
            type: "text",
            text: "ช่วยวิเคราะห์ปลากัดจากภาพนี้ บอกสายพันธุ์ ลักษณะสี และคำแนะนำการเลี้ยง",
          },
          {
            type: "image_url",
            image_url: {
              url: `data:image/jpeg;base64,${base64Image}`,
            },
          },
        ],
      },
    ],
  });

  // ควร normalize output ตรงนี้ตามที่คุณใช้
  return {
    species_name: response.choices[0].message.content,
    color_traits: "",
    care_tips: "",
  };
}

/**
 * ตอบคำถามแชท (เฉพาะเรื่องปลากัด)
 */
export async function chatAboutBetta(question, context) {
  const response = await client.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "คุณคือผู้เชี่ยวชาญปลากัด ตอบเฉพาะเรื่องปลากัดเท่านั้น ถ้าไม่เกี่ยวให้ปฏิเสธสุภาพ",
      },
      {
        role: "user",
        content: `
ข้อมูลปลากัด:
${JSON.stringify(context, null, 2)}

คำถาม:
${question}
        `,
      },
    ],
  });

  return response.choices[0].message.content;
}
