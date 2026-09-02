import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { analyzeSituation, translateGuidance } from "./gemini.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load root .env (single call; dotenv is idempotent)
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security Headers (helmet) ────────────────────────────────────────────────
app.use(
  helmet({
    // Allow Google Fonts CDN for the client HTML
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "blob:"],
        connectSrc: ["'self'"]
      }
    }
  })
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
// Restrict to the configured origin (default: localhost dev server)
const allowedOrigins = (process.env.ALLOWED_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, cb) => {
      // Allow requests with no origin (e.g. curl, mobile apps, same-origin)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      cb(new Error(`CORS: Origin ${origin} not permitted`));
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);

// ─── Body Parsing ─────────────────────────────────────────────────────────────
app.use(express.json({ limit: "30mb" }));
app.use(express.urlencoded({ extended: true, limit: "30mb" }));

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Protect AI endpoints from quota abuse: max 20 requests per minute per IP
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,       // 1 minute
  max: 20,                    // limit each IP to 20 requests per window
  standardHeaders: true,      // return rate-limit info in headers
  legacyHeaders: false,
  message: {
    success: false,
    error:
      "Too many requests from this IP. Please wait a minute and try again. " +
      "For emergencies, contact services directly at 112."
  }
});

app.use("/api/", apiLimiter);

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  const hasKey = Boolean(
    process.env.GEMINI_API_KEY &&
      process.env.GEMINI_API_KEY !== "your_api_key_here" &&
      process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
  );
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
      error:
        error.message ||
        "We couldn't analyze the situation right now. If this is an emergency, contact emergency services (112) immediately."
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

// ─── Static Client (production build) ────────────────────────────────────────
// Serve the built React app if present; do NOT fall back to the legacy
// public/ vanilla-JS prototype (different schema, different UI).
const clientDist = path.join(__dirname, "../client/dist");
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.use((req, res) => {
    res.sendFile(path.join(clientDist, "index.html"));
  });
} else {
  // No build available — return a clear status instead of serving a
  // mismatched legacy UI.
  app.get("/", (req, res) => {
    res.status(200).json({
      status: "ok",
      message:
        "SafeAid AI backend is running. Run `npm run build` to serve the React client, or start the dev server with `npm run dev`.",
      api: `/api/health`
    });
  });
}

// ─── Server Start ─────────────────────────────────────────────────────────────
if (process.env.NODE_ENV !== "test" && !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`=======================================================`);
    console.log(`🛡 SafeAid AI Backend Running on Port ${PORT}`);
    console.log(`🔗 API Endpoints: http://localhost:${PORT}/api/health`);
    console.log(
      `🔑 Gemini Configured: ${Boolean(
        process.env.GEMINI_API_KEY &&
          process.env.GEMINI_API_KEY !== "your_gemini_api_key_here"
      )}`
    );
    console.log(
      `🤖 Model: ${process.env.GEMINI_MODEL || "gemini-2.5-flash"}`
    );
    console.log(
      `🌐 CORS Origins: ${allowedOrigins.join(", ")}`
    );
    console.log(`=======================================================`);
  });
}

export default app;
