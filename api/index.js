import express from "express";
import analyzeRoutes from "./routes/analyze.routes.js";
import authRoutes from "./routes/auth.routes.js";
import recordRoutes from "./routes/record.routes.js";
import { connectDB } from "./db.js";

const app = express();
app.use(express.json());

// health check
app.get("/", (req, res) => res.send("Betta Backend is running"));

app.use("/api/analyze", analyzeRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/record", recordRoutes);

const PORT = process.env.PORT || 3000;

connectDB()
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error("DB connect failed:", err.message);
    process.exit(1);
  });
