import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * 🧬 GOD ENGINE V17 — FULL LOCK BREEDER MODE
 * ✔ Wild Gate จริง
 * ✔ Lock Betta Only
 * ✔ Stop Goldfish / ปลาอื่น
 * ✔ Morphology Priority Fix
 */

export async function analyzeBettaImage({
  imageBase64,
  mimeType = "image/jpeg",
}) {
  try {
    console.log("🔥 GOD ENGINE V17 START");

    const imageDataUrl = `data:${mimeType};base64,${imageBase64}`;

    /**
     * =====================================================
     * 🧠 PASS 0 — BETTA ONLY GUARD
     * =====================================================
     */

    const bettaCheck = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: [{
            type: "input_text",
            text: `
ตรวจว่าคือ "ปลากัด Betta" หรือไม่

ถ้าไม่ใช่ปลากัดให้ตอบ:
NOT_BETTA

ถ้าใช่ตอบ:
BETTA

ตอบ TEXT ONLY
`
          }]
        },
        {
          role: "user",
          content: [{ type:"input_image", image_url:imageDataUrl }]
        }
      ]
    });

    const bettaType =
      bettaCheck.output?.[0]?.content?.[0]?.text ||
      bettaCheck.output_text ||
      "";

    if (!bettaType.toLowerCase().includes("betta")) {
      return {
        status:"not_supported",
        breed_estimate:"Not Betta",
        betta_group:"Unknown",
        short_reason:"ระบบรองรับเฉพาะปลากัดเท่านั้น",
        confidence:100
      };
    }

    /**
     * =====================================================
     * 🧬 PASS 1 — WILD DETECTOR (สำคัญมาก)
     * =====================================================
     */

    const wildCheck = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role:"system",
          content:[{
            type:"input_text",
            text:`
ตรวจว่าเป็น Wild Betta หรือ Fancy Betta

Wild = imbellis / mahachai / smaragdina / wild form

ตอบ ONLY:
WILD
หรือ
FANCY
`
          }]
        },
        {
          role:"user",
          content:[{ type:"input_image", image_url:imageDataUrl }]
        }
      ]
    });

    const wildType =
      wildCheck.output?.[0]?.content?.[0]?.text ||
      wildCheck.output_text ||
      "";

    if (wildType.toLowerCase().includes("wild")) {
      return {
        status:"success",
        breed_estimate:"Wild Betta",
        breed_estimate_th:"ปลากัดป่า",
        betta_group:"Wild Betta (ปลากัดป่า)",
        short_reason:"ลักษณะโครงสร้างเป็น Wild Form ไม่ใช่สายประกวด",
        morphology:"Wild Body",
        confidence:95
      };
    }

    /**
     * =====================================================
     * PASS 2 — MORPHOLOGY DETECTOR
     * =====================================================
     */

    const classify = await openai.responses.create({
      model:"gpt-4.1-mini",
      input:[
        {
          role:"system",
          content:[{
            type:"input_text",
            text:`
คุณคือ Morphology Detector ปลากัด

ตรวจหา:
- Long Fin
- Halfmoon Spread 180 Degree
- Crowntail Spine (web reduction จริงเท่านั้น)
- Elephant Ear Dumbo
- Plakat Short Fin

ตอบ TEXT ONLY
`
          }]
        },
        {
          role:"user",
          content:[{ type:"input_image", image_url:imageDataUrl }]
        }
      ]
    });

    const morph =
      classify.output?.[0]?.content?.[0]?.text ||
      classify.output_text ||
      "Unknown";

    console.log("🧬 MORPH =", morph);

    /**
     * =====================================================
     * PASS 3 — EXPERT JUDGE
     * =====================================================
     */

    const res = await openai.responses.create({
      model:"gpt-4.1-mini",
      input:[
        {
          role:"system",
          content:[{
            type:"input_text",
            text:`
คุณคือกรรมการปลากัดระดับประกวด

Morphology = ${morph}

กฎสำคัญ:
- ห้ามเดาปลากัดป่า
- Halfmoon ต้อง 180 องศา
- Crowntail ต้อง web reduction จริง
- Dumbo ต้องครีบอกใหญ่

ตอบ JSON ONLY:

{
 "status":"success",
 "breed_estimate":"",
 "breed_estimate_th":"",
 "betta_group":"",
 "betta_group_th":"",
 "short_reason":"",
 "confidence":0
}
`
          }]
        },
        {
          role:"user",
          content:[{ type:"input_image", image_url:imageDataUrl }]
        }
      ]
    });

    /**
     * =====================================================
     * SAFE JSON PARSER
     * =====================================================
     */

    let data = {};
    try {
      let text =
        res.output?.[0]?.content?.[0]?.text ||
        res.output_text ||
        "{}";

      text = text.replace(/```json/gi,"").replace(/```/g,"").trim();
      data = JSON.parse(text);
    } catch {
      data = { status:"parse_error" };
    }

    data.morphology = morph;

    /**
     * =====================================================
     * 🧠 FINAL GROUP PRIORITY
     * =====================================================
     */

    const m = morph.toLowerCase();

    if (m.includes("elephant")) {
      data.betta_group = "Dumbo Elephant Ear (หูช้าง)";
    }
    else if (m.includes("crowntail")) {
      data.betta_group = "Crowntail (คราวน์เทล)";
    }
    else if (m.includes("halfmoon")) {
      data.betta_group = "Halfmoon (ฮาฟมูน)";
    }
    else if (m.includes("short")) {
      data.betta_group = "Plakat (ปลากัดครีบสั้น)";
    }

    /**
     * =====================================================
     * CONFIDENCE NORMALIZE
     * =====================================================
     */

    let conf = data.confidence ?? 0;

    if (typeof conf === "number") {
      if (conf <= 1) conf = Math.round(conf * 100);
      else if (conf <= 100) conf = Math.round(conf);
      else conf = 90;
    } else {
      conf = 75;
    }

    data.confidence = conf;

    if (data.breed_estimate && data.breed_estimate_th) {
      data.breed_estimate =
        `${data.breed_estimate} (${data.breed_estimate_th})`;
    }

    console.log("✅ GOD ENGINE V17 RESULT =", data);

    return data;

  } catch (err) {
    console.error("🔥 GOD ENGINE V17 ERROR:", err);
    throw err;
  }
}