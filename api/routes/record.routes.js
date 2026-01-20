import express from "express";
import { authRequired } from "../../middleware/auth.middleware.js";
import FishRecord from "../../models/FishRecord.js";

const router = express.Router();

// GET /api/record  → ดึงเฉพาะของ user ที่ login อยู่
router.get("/", authRequired, async (req, res) => {
  try {
    const rows = await FishRecord.find({ userId: req.user.userId }).sort({
      createdAt: -1,
    });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "fetch_failed", message: String(err) });
  }
});

// POST /api/record  → เพิ่ม record ใหม่ของ user
router.post("/", authRequired, async (req, res) => {
  try {
    // ✅ เพิ่ม imageName
    const { fishName, type, color, note, imageUrl, imageName } = req.body;

    if (!fishName) {
      return res.status(400).json({ error: "missing_fishName" });
    }

    // ✅ เช็ค imageName เพราะใน schema required
    if (!imageName) {
      return res.status(400).json({ error: "missing_imageName" });
    }

    const doc = await FishRecord.create({
      userId: req.user.userId,
      fishName,
      type,
      color,
      note,
      imageUrl,
      imageName, // ✅ ใส่เพิ่มตรงนี้
    });

    res.json({ ok: true, id: doc._id });
  } catch (err) {
    res.status(500).json({ error: "create_failed", message: String(err) });
  }
});

export default router;
