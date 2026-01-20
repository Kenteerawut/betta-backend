import express from "express";
import multer from "multer";
import { authRequired } from "api/middleware/auth.middleware.js";
import { analyzeBettaImage } from "../utils/openai.js";
import FishRecord from "../models/FishRecord.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /analyze
router.post("/", authRequired, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no_file" });
    }

    // 1) แปลงภาพเป็น base64
    const base64Image = req.file.buffer.toString("base64");

    // 2) เรียก OpenAI วิเคราะห์
    const result = await analyzeBettaImage(base64Image);

    // 3) บันทึกลง MongoDB
    const record = await FishRecord.create({
      userId: req.user.userId,
      imageName: req.file.originalname,
      species_name: result.species_name,
      color_traits: result.color_traits,
      care_tips: result.care_tips,
      model_version: "openai-gpt-vision",
    });

    // 4) ส่งผลลัพธ์กลับ
    res.json({
      id: record._id,
      ...result,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "analyze_failed", message: String(err) });
  }
});

export default router;
