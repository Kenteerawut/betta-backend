import express from "express";
import multer from "multer";
import { authRequired } from "../../middleware/auth.middleware.js";
import { analyzeBettaImage } from "../../utils/openai.js";
import FishRecord from "../../models/FishRecord.js";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// POST /api/analyze  (วิเคราะห์ + บันทึก record อัตโนมัติ)
router.post("/", authRequired, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "no_file" });
    }

    // 1) แปลงรูปเป็น base64 ส่งให้ OpenAI
    const base64Image = req.file.buffer.toString("base64");
    const result = await analyzeBettaImage(base64Image);

    // 2) เตรียมข้อมูลสำหรับบันทึก Record
    // หมายเหตุ: ปรับ mapping ให้เข้ากับ format result ของคุณได้
    const fishName = result?.fishName || "";
    const type = result?.type || "";
    const color = result?.color || "";
    const note = result?.note || "";

    // 3) บันทึกลง MongoDB
    const doc = await FishRecord.create({
      userId: req.user.userId,

      fishName,
      type,
      color,
      note,

      imageName: req.file.originalname, // required
      imageUrl: "", // ตอนนี้ยังไม่ได้อัปโหลดไป storage ภายนอก
    });

    // 4) ส่งผลกลับให้ frontend
    res.json({
      ok: true,
      recordId: doc._id,
      result,
    });
  } catch (err) {
    res.status(500).json({
      error: "analyze_failed",
      message: String(err),
    });
  }
});

export default router;
