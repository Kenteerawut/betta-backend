import jwt from "jsonwebtoken";

export const authRequired = (req, res, next) => {
  try {
    const header = req.headers.authorization;
    if (!header) return res.status(401).json({ error: "no_token" });

    const token = header.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // เก็บข้อมูล user ไว้ใน req
    req.user = decoded; // { userId, email, iat, exp }

    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid_token" });
  }
};
