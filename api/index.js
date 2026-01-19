import express from "express";

const app = express();
app.use(express.json());

app.get("/api", (req, res) => {
  res.json({ ok: true });
});

export default function handler(req, res) {
  return app(req, res);
}
