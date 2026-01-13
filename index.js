import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

// import routes
import authRoutes from "./routes/auth.routes.js";
import analyzeRoutes from "./routes/analyze.routes.js";
import recordRoutes from "./routes/record.routes.js";

const app = express();

// middleware
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// connect MongoDB
await mongoose.connect(process.env.MONGO_URI);
console.log("✅ MongoDB connected");

// mount routes
app.use("/auth", authRoutes);
app.use("/analyze", analyzeRoutes);
app.use("/records", recordRoutes);

// health
app.get("/health", (_req, res) => {
  res.json({ ok: true });
});

// root (optional)
app.get("/", (_req, res) => {
  res.send("BettaFish Backend API is running");
});

// start server
app.listen(process.env.PORT || 3001, () => {
  console.log(`🚀 Server running on http://localhost:${process.env.PORT || 3001}`);
});
