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

router.post("/", authRequired, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no_file" });
    }

    const base64Image = req.file.buffer.toString("base64");

    console.log("🔥 analyze start");

    const result = await analyzeBettaImage({
      imageBase64: base64Image,
      question: req.body.question || "",
    });

    console.log("🔥 AI RESULT:", result);

    if (!result) {
      return res.status(500).json({
        error: "ai_no_result",
      });
    }

    const doc = await FishRecord.create({
      userId: req.user.userId,
      fishName: result.breed_estimate || "",
      type: result.betta_group || "",
      color: "",
      note: result.short_reason || "",
      imageName: req.file.originalname,
      imageUrl: "",
    });

    res.json({
      ok: true,
      result,
      recordId: doc._id,
    });
  } catch (err) {
    console.error("🔥 ANALYZE ERROR:", err);

    res.status(500).json({
      error: "analyze_failed",
      message: String(err),
    });
  }
});

export default router;