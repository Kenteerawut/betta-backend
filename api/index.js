import express from "express";
import analyzeRoutes from "./routes/analyze.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";

const app = express();

app.use(express.json());

/** ✅ health check (ตัวนี้แหละที่ทำให้ GET /api ไม่ 404) */
app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/record", recordRoutes);

/** ✅ สำคัญสำหรับ Vercel */
export default function handler(req, res) {
  return app(req, res);
}
