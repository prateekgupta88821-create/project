import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { analyzeSituation, translateGuidance } from "./gemini.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// Health check endpoint
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== "your_api_key_here");
  res.json({
    status: "ok",
    configured: hasKey,
    model: process.env.GEMINI_MODEL || "gemini-2.5-flash",
    app: "SafeAid AI - Campus Health & Safety Companion"
  });
});

/**
 * POST /api/analyze
 * Body: { text: string, image: string }
 * Returns: { success: true, data: {...} }
 */
app.post("/api/analyze", async (req, res) => {
  try {
    const { text, image } = req.body || {};

    if (!text && !image) {
      return res.status(400).json({
        success: false,
        error: "Please provide a situation description, an image, or both."
      });
    }

    const guidance = await analyzeSituation({ text, image });
    res.json({
      success: true,
      data: guidance
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(error.status || 500).json({
      success: false,
      error: error.message || "We couldn't analyze the situation right now. If this is an emergency, contact emergency services (112) immediately."
    });
  }
});

/**
 * POST /api/translate
 * Body: { content: Object, language: string }
 * Returns: { success: true, data: {...} }
 */
app.post("/api/translate", async (req, res) => {
  try {
    const { content, language } = req.body || {};

    if (!content || !language) {
      return res.status(400).json({
        success: false,
        error: "Missing content or target language."
      });
    }

    const translated = await translateGuidance({ content, language });
    res.json({
      success: true,
      data: translated
    });
  } catch (error) {
    console.error("Translation Endpoint Error:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to translate guidance."
    });
  }
});

// Serve client/dist static assets if built
const clientDist = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  // If frontend build not present yet, fallback to public or status
  const publicDir = path.join(__dirname, "../public");
  if (fs.existsSync(publicDir)) {
    app.use(express.static(publicDir));
  }
}

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🛡 SafeAid AI Backend Running on Port ${PORT}`);
    console.log(`🔗 API Endpoints: http://localhost:${PORT}/api/health`);
    console.log(`🔑 Gemini Configured: ${Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_api_key_here')}`);
    console.log(`🤖 Model: ${process.env.GEMINI_MODEL || "gemini-2.5-flash"}`);
    console.log(`=======================================================`);
  });
}

export default app;
