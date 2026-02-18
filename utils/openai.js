import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function analyzeBettaImage({ imageBase64, mimeType = "image/jpeg", question = "" }) {

  const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

  const res = await openai.responses.create({
    model: "gpt-4.1-mini",
    input: [
      {
        role: "user",
        content: [
          {
            type: "input_text",
            text: question || "วิเคราะห์ปลากัดจากภาพนี้",
          },
          {
            type: "input_image",
            image_url: imageDataUrl,
          },
        ],
      },
    ],
  });

  return {
    answer: res.output_text,
  };
}
