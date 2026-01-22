import express from "express";
import cors from "cors";

import analyzeRoutes from "./routes/analyze.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import { connectDB } from "./db.js";

const app = express();

/**
 * CORS – อนุญาตทุก origin (แก้ iOS / Mobile Safari)
 */
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.options("*", cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Betta Backend is running");
});

app.get("/api", (req, res) => {
  res.json({ ok: true, message: "API running on Railway" });
});

app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/records", recordRoutes);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DB connect failed:", err.message);
    process.exit(1);
  });
