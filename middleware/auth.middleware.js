import jwt from "jsonwebtoken";

export function authRequired(req, res, next) {
  try {
    const header = req.headers.authorization || "";
    const [type, token] = header.split(" ");

    if (type !== "Bearer" || !token) {
      return res.status(401).json({ error: "missing_token" });
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = payload; // { userId: ... }
    next();
  } catch (err) {
    return res.status(401).json({ error: "invalid_token" });
  }
}
