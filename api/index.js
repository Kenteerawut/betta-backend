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
 * ==============================
 * ✅ CORS (Railway + Mobile Safari SAFE)
 * ==============================
 */
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/**
 * ✅ JSON parser
 */
app.use(express.json({ limit: "10mb" }));

/**
 * ==============================
 * ✅ Health check
 * ==============================
 */
app.get("/", (req, res) => {
  res.send("Betta Backend is running");
});

app.get("/api", (req, res) => {
  res.json({ ok: true, message: "API running on Railway" });
});

/**
 * ==============================
 * ✅ API Routes
 * ==============================
 */
app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/chat", chatRoutes);

/**
 * ==============================
 * ❗ Global Error Handler (สำคัญมาก)
 * กัน server crash แล้ว analyze เพี้ยน
 * ==============================
 */
app.use((err, req, res, next) => {
  console.error("🔥 GLOBAL ERROR:", err);
  res.status(500).json({
    error: "internal_server_error",
  });
});

/**
 * ==============================
 * ✅ Start Server
 * ==============================
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