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
 * 📂 CREATE UPLOAD FOLDER
 * ==============================
 */
const uploadDir = "uploads";

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

/**
 * ==============================
 * 📸 MULTER — SAVE FILE TO DISK
 * ==============================
 */
const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "_");

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
      if (!req.file) {
        return res.status(400).json({ error: "no_file" });
      }

      console.log("🔥 analyze start");

      const base64Image = fs
        .readFileSync(req.file.path)
        .toString("base64");

      const result = await analyzeBettaImage({
        imageBase64: base64Image,
      });

      if (!result) {
        return res.status(500).json({
          error: "ai_no_result",
        });
      }

      /**
       * ✅ SAVE RECORD WITH IMAGE URL
       */
      const doc = await FishRecord.create({
        userId: req.user.userId,
        fishName: result.breed_estimate || "",
        type: result.betta_group || "",
        color: "",
        note: result.short_reason || "",
        imageName: req.file.filename,
        imageUrl: `/uploads/${req.file.filename}`,
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
  }
);

export default router;