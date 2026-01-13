import "dotenv/config";
import fs from "fs";
import { analyzeBettaImage } from "./utils/openai.js";

// อ่านไฟล์รูปจากเครื่อง
const imageBuffer = fs.readFileSync("test.jpg");
const base64Image = imageBuffer.toString("base64");

const run = async () => {
  try {
    const result = await analyzeBettaImage(base64Image);
    console.log("AI RESULT:", result);
  } catch (err) {
    console.error("ERROR:", err);
  }
};

run();
