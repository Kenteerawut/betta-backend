export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
  question = "",
}) {
  try {
    console.log("🔥 PRO ANALYZE START");

    // ✅ ต้องมี backtick
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

    console.log("🔥 PRO ANALYZE SUCCESS");

    return {
      answer: res.output_text || "",
    };
  } catch (err) {
    console.error("🔥 OPENAI ERROR:", err);
    throw err;
  }
}
