import express from "express";

const router = express.Router();

router.post("/register", (req, res) => {
  res.json({ route: "register ok" });
});

router.post("/login", (req, res) => {
  res.json({ route: "login ok" });
});

export default router;
