import express from "express";
import multer from "multer";
import { authRequired } from "../../middleware/auth.middleware.js";
import { analyzeBettaImage } from "../../utils/openai.js";
import FishRecord from "../../models/FishRecord.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

// POST /api/analyze
router.post("/", authRequired, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no_file" });
    }

    // 🔹 รับคำถามจาก frontend
    const question = req.body.question || "";

    // 🔹 แปลงรูปเป็น base64
    const base64Image = req.file.buffer.toString("base64");

    // 🔹 ส่งรูป + คำถามเข้า AI
    const result = await analyzeBettaImage({
      imageBase64: base64Image,
      question,
    });

    // 🔹 map ข้อมูลสำหรับบันทึก
    const fishName = result?.fishName || "";
    const type = result?.type || "";
    const color = result?.color || "";
    const note = result?.answer || "";

    const doc = await FishRecord.create({
      userId: req.user.userId,
      fishName,
      type,
      color,
      note,
      imageName: req.file.originalname,
      imageUrl: "",
    });

    res.json({
      ok: true,
      recordId: doc._id,
      answer: result.answer,
      raw: result,
    });
  } catch (err) {
    res.status(500).json({
      error: "analyze_failed",
      message: String(err),
    });
  }
});

export default router;
