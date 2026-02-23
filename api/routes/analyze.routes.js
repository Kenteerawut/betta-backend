import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

import { authRequired } from "../../middleware/auth.middleware.js";
import { analyzeBettaImage } from "../../utils/openai.js";
import FishRecord from "../../models/FishRecord.js";

const router = express.Router();

/**
 * ==============================
 * 🔥 RAILWAY SAFE STORAGE
 * ==============================
 */
const uploadDir =
  process.env.RAILWAY_ENVIRONMENT
    ? "/tmp/uploads"
    : "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

/**
 * ==============================
 * 📸 MULTER STORAGE
 * ==============================
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const safeName = file.originalname
      .replace(/\s+/g, "_")
      .replace(/[^\w.-]/g, "");

    const uniqueName = `${Date.now()}-${safeName}`;

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
});

/**
 * ==============================
 * 🧠 ANALYZE ROUTE
 * ==============================
 */
router.post(
  "/",
  authRequired,
  upload.single("image"),
  async (req, res) => {
    try {
      console.log("🔥 ANALYZE ROUTE HIT");

      if (!req.file) {
        console.log("❌ NO FILE");
        return res.status(400).json({ error: "no_file" });
      }

      const filePath = path.join(uploadDir, req.file.filename);

      if (!fs.existsSync(filePath)) {
        console.log("❌ FILE NOT FOUND:", filePath);
        return res.status(500).json({ error: "file_missing" });
      }

      const base64Image = fs.readFileSync(filePath).toString("base64");

      console.log("🧠 Sending image to AI...");

      const result = await analyzeBettaImage({
        imageBase64: base64Image,
      });

      if (!result) {
        console.log("❌ AI NO RESULT");
        return res.status(500).json({
          error: "ai_no_result",
        });
      }

      /**
       * ✅ SAVE RECORD
       */
      const doc = await FishRecord.create({
        userId: req.user.userId,
        fishName: result.breed_estimate || "",
        type: result.betta_group || "",
        note: result.short_reason || "",
        imageName: req.file.filename,
      });

      console.log("✅ RECORD SAVED:", doc._id);

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
  }
);

export default router;