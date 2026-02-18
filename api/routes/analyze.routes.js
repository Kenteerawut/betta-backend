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

    const question = req.body.question || "";
    const base64Image = req.file.buffer.toString("base64");

    // 🔥 เรียก AI
    const ai = await analyzeBettaImage({
      imageBase64: base64Image,
      question,
    });

    // 🔥 map ให้ตรง frontend
    const result = {
      species_name: ai?.fishName || "",
      color_traits: ai?.color || "",
      care_tips: ai?.answer || "",
    };

    // 🔥 บันทึก DB
    const doc = await FishRecord.create({
      userId: req.user.userId,
      fishName: ai?.fishName || "",
      type: ai?.type || "",
      color: ai?.color || "",
      note: ai?.answer || "",
      imageName: req.file.originalname,
      imageUrl: "",
    });

    // ✅ IMPORTANT: ต้องมี result
    res.json({
      ok: true,
      recordId: doc._id,
      result,
    });

  } catch (err) {
    console.error("ANALYZE ERROR:", err); // ⭐ เพิ่ม log ไว้ดู Railway
    res.status(500).json({
      error: "analyze_failed",
      message: String(err),
    });
  }
});

export default router;
