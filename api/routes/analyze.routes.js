import express from "express";
import multer from "multer";
import { authRequired } from "../../middleware/auth.middleware.js";
import { analyzeBettaImage } from "../../utils/openai.js";
import FishRecord from "../../models/FishRecord.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// POST /analyze
router.post(
  "/",
  authRequired,
  upload.single("image"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "no_file" });
      }

      const base64Image = req.file.buffer.toString("base64");
      const result = await analyzeBettaImage(base64Image);

      res.json(result);
    } catch (err) {
      res.status(500).json({
        error: "analyze_failed",
        message: String(err),
      });
    }
  }
);

export default router;