import express from "express";
import authRoutes from "../routes/auth.routes.js";

const app = express();

app.use(express.json());

app.use("/api/auth", authRoutes);

// health check
app.get("/", (req, res) => {
  res.json({ ok: true });
});

export default app;
