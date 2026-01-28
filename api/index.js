import express from "express";
import cors from "cors";

import analyzeRoutes from "./routes/analyze.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import chatRoutes from "./routes/chat.routes.js";

import { connectDB } from "./db.js";

const app = express();

/**
 * ✅ CORS – รองรับ Railway + Mobile Safari (Express 5 compatible)
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// ❌ Express 5 ไม่ต้องใช้ app.options("*")

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
 * ✅ Routes
 */
app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);
app.use("/api/chat", chatRoutes); // ✅ CHAT STREAMING

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
