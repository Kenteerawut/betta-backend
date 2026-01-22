import express from "express";
import cors from "cors";

import analyzeRoutes from "./routes/analyze.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import { connectDB } from "./db.js";

const app = express();

/**
 * ✅ CORS CONFIG (สำคัญมาก)
 * - รองรับ Railway
 * - รองรับ Mobile Safari / iOS
 * - แก้ปัญหา "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้"
 */
app.use(
  cors({
    origin: true,          // อนุญาตทุก origin (mobile + production)
    credentials: true,     // จำเป็นสำหรับ Authorization header
  })
);

// รองรับ preflight (OPTIONS) สำหรับ POST/PUT บนมือถือ
app.options("*", cors());

// JSON body
app.use(express.json());

/**
 * ✅ Health check
 */
app.get("/", (req, res) => {
  res.send("Betta Backend is running");
});

/**
 * ✅ API root
 */
app.get("/api", (req, res) => {
  res.json({ ok: true, message: "API running on Railway" });
});

/**
 * ✅ Routes (ต้องตรง frontend)
 */
app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);

/**
 * ✅ Start server
 */
const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ DB connect failed:", err.message);
    process.exit(1);
  });
