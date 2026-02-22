import express from "express";
import cors from "cors";
import "dotenv/config";

import analyzeRoutes from "./routes/analyze.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import { connectDB } from "./db.js";

const app = express();

/**
 * ✅ CORS – รองรับ Railway + Mobile Safari
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json());

/**
 * 🔥 ULTRA FIX — SERVE UPLOADED IMAGES
 * ถ้าไม่มีบรรทัดนี้ รูปจะไม่ขึ้นหน้า records
 */
app.use("/uploads", express.static("uploads"));

/**
 * ✅ Health check
 */
app.get("/", (req, res) => {
  res.send("Betta Backend is running");
});

app.get("/api", (req, res) => {
  res.json({ ok: true, message: "API running on Railway" });
});

/**
 * ✅ Routes
 */
app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/chat", chatRoutes);

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

console.log("🔥 BACKEND INDEX UPDATED", new Date().toISOString());