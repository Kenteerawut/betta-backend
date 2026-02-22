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

/**
 * ===============================
 * 🔥 Betta Guard System
 * กัน AI มั่วสายพันธุ์
 * ===============================
 */

const BETTA_ALLOWED = [
  "betta",
  "halfmoon",
  "plakat",
  "crowntail",
  "double tail",
  "wild",
  "dumbo",
  "elephant ear",
];

const FORBIDDEN_FISH = [
  "goldfish",
  "guppy",
  "tetra",
  "koi",
  "cichlid",
];

function sanitizeResult(result) {
  if (!result) return null;

  let fishName = String(result.fishName || "").toLowerCase();

  // ❌ ถ้าไม่ใช่ปลากัด ตัดทิ้งทันที
  if (FORBIDDEN_FISH.some((f) => fishName.includes(f))) {
    return {
      fishName: "ไม่ใช่ปลากัด",
      type: "unknown",
      color: "",
      answer: "ระบบนี้รองรับเฉพาะปลากัดเท่านั้น",
    };
  }

  // ❌ ถ้า AI ไม่พูดคำว่า betta เลย ให้ถือว่าไม่ใช่
  if (!BETTA_ALLOWED.some((b) => fishName.includes(b))) {
    return {
      fishName: "ไม่พบปลากัด",
      type: "unknown",
      color: "",
      answer: "ไม่สามารถยืนยันว่าเป็นปลากัดได้",
    };
  }

  return result;
}

/**
 * ===============================
 * 🚀 Analyze API
 * ===============================
 */
router.post("/", authRequired, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no_file" });
    }

    const base64Image = req.file.buffer.toString("base64");

    console.log("🔥 analyze start");

    /**
     * 🔒 Lock Question Topic (ถามได้เฉพาะปลากัด)
     */
    let question = req.body.question || "";
    if (question && !question.toLowerCase().includes("ปลา")) {
      question = "ตอบเฉพาะข้อมูลเกี่ยวกับปลากัดเท่านั้น";
    }

    const aiRaw = await analyzeBettaImage({
      imageBase64: base64Image,
      question,
    });

    console.log("🔥 AI RAW:", aiRaw);

    const result = sanitizeResult(aiRaw);

    if (!result) {
      return res.status(500).json({
        error: "ai_no_result",
      });
    }

    /**
     * ===============================
     * 💾 Save Record
     * ===============================
     */
    const doc = await FishRecord.create({
      userId: req.user.userId,
      fishName: result.fishName || "",
      type: result.type || "",
      color: result.color || "",
      note: result.answer || "",
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