import express from "express";
import authRoutes from "../routes/auth.routes.js";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ ok: true });
});

app.use("/api/auth", authRoutes);

export default function handler(req, res) {
  return app(req, res);
}
