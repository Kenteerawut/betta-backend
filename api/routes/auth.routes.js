import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../../models/user.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ error: "email_taken" });
    }

    const hashed = await bcrypt.hash(password, 10);

    // schema ใช้ passwordHash
    const newUser = await User.create({ email, passwordHash: hashed });

    return res.json({ ok: true, userId: newUser._id });
  } catch (err) {
    return res
      .status(500)
      .json({ error: "register_failed", message: String(err) });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "missing_fields" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    // schema ใช้ passwordHash
    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res.status(401).json({ error: "invalid_credentials" });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: "missing_jwt_secret" });
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.json({ token });
  } catch (err) {
    return res.status(500).json({ error: "login_failed", message: String(err) });
  }
});

export default router;
