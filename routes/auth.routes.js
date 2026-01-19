import express from "express";
import bcrypt from "bcryptjs"; // ใช้ bcryptjs เท่านั้น
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    const hash = await bcrypt.hash(password, 10);
    await User.create({ email, password: hash });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "invalid" });

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(401).json({ error: "invalid" });

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "JWT_SECRET missing" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
