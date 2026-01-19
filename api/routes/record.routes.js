import express from "express";
import { authRequired } from "../../middleware/auth.middleware.js";
import FishRecord from "../../models/FishRecord.js";

const router = express.Router();

// GET /records  → ดึงเฉพาะของ user ที่ login อยู่
router.get("/", authRequired, async (req, res) => {
  try {
    const rows = await FishRecord.find({ userId: req.user.userId })
      .sort({ createdAt: -1 });

    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: "fetch_failed", message: String(err) });
  }
});

export default router;
