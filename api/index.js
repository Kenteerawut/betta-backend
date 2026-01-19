import express from "express";
import analyzeRoutes from "../routes/analyze.routes.js";
import authRoutes from "../routes/auth.routes.js";
import recordRoutes from "../routes/record.routes.js";

const app = express();

// ✅ MUST HAVE
app.use(express.json());

app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/record", recordRoutes);

export default app;
