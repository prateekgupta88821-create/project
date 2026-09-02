import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from project root .env
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const SAFETY_SYSTEM_INSTRUCTION = `You are SafeAid AI, an emergency first-aid and campus safety guidance assistant.

Your job is to provide concise, practical and safe first-aid guidance.

You must NOT diagnose medical conditions.

You must NOT claim certainty from an image.

When the situation appears life-threatening or potentially serious, prioritize contacting emergency services and a qualified medical professional.

Always provide immediate safety actions first.

Never recommend dangerous home remedies.

Never recommend delaying emergency medical care.

If the situation is unclear, state the uncertainty and recommend seeking professional help.

Keep instructions short and numbered so a stressed person can follow them.

For emergency situations, clearly mark the response as HIGH or CRITICAL priority.

Return ONLY valid JSON matching the requested schema.`;

const JSON_SCHEMA_PROMPT = `
You MUST return ONLY a strictly valid JSON object matching this schema:
{
  "situation": "Short descriptive title of the incident/concern (e.g. Minor Second-Degree Thermal Burn)",
  "category": "medical | fire | electrical | chemical | environmental | other",
  "severity": "low | medium | high | critical",
  "confidence": 0.85,
  "summary": "Brief 1-2 sentence plain summary of what is observed and primary initial assessment. If an image is provided but unclear, explicitly state that the image cannot reliably determine the situation.",
  "immediate_actions": [
    "1. Immediate action step...",
    "2. Subsequent action step...",
    "3. Protection or dressing step..."
  ],
  "avoid": [
    "Do NOT apply ice directly...",
    "Do NOT pop blisters..."
  ],
  "when_to_seek_help": [
    "Seek immediate emergency care if...",
    "Contact campus medical center if..."
  ],
  "emergency_required": false,
  "emergency_reason": "Provide reason if emergency_required is true, otherwise empty string"
}`;

const CANDIDATE_MODELS = [
  process.env.GEMINI_MODEL || "gemini-2.5-flash",
  "gemini-2.5-flash",
  "gemini-2.0-flash",
  "gemini-1.5-flash"
];

// Deduplicate candidate models
const UNIQUE_MODELS = [...new Set(CANDIDATE_MODELS)];

export function parseImagePayload(image) {
  if (!image) return null;

  let mimeType = "image/jpeg";
  let base64Data = "";

  if (typeof image === "string") {
    const match = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1].toLowerCase();
      base64Data = match[2].trim();
    } else {
      base64Data = image.trim();
    }
  } else if (typeof image === "object" && image.data) {
    base64Data = typeof image.data === "string" ? image.data.trim() : "";
    if (image.mimeType) mimeType = image.mimeType.toLowerCase();
    const match = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1].toLowerCase();
      base64Data = match[2].trim();
    }
  }

  if (mimeType === "image/jpg") mimeType = "image/jpeg";

  const cleanData = base64Data.replace(/\s/g, "");
  if (!cleanData || cleanData.length < 10) {
    throw new Error("Invalid or corrupt image data.");
  }

  return { mimeType, data: cleanData };
}

function getClient() {
  const key = process.env.GEMINI_API_KEY?.trim();
  if (!key || key === "your_api_key_here") {
    return null;
  }
  return new GoogleGenAI({ apiKey: key });
}

export async function analyzeSituation({ text = "", image = null }) {
  const trimmedText = typeof text === "string" ? text.trim() : "";
  const parsedImage = image ? parseImagePayload(image) : null;

  if (!trimmedText && !parsedImage) {
    throw new Error("Please provide a situation description, an image, or both.");
  }

  const client = getClient();
  if (!client) {
    return getOfflineFallback(trimmedText, !!parsedImage);
  }

  let promptText = "";
  if (parsedImage && trimmedText) {
    promptText = `User Description: "${trimmedText}"\n\nPrompt: Analyze the provided image only for visible safety-relevant information. Do not diagnose. Combine the image observations with the user's description and provide safe first-aid guidance.\n\n${JSON_SCHEMA_PROMPT}`;
  } else if (parsedImage) {
    promptText = `User provided an image of an injury or safety hazard without text.\n\nPrompt: Analyze the provided image only for visible safety-relevant information. Do not diagnose. If the image is unclear or low resolution, explicitly state that the image cannot reliably determine the situation. Provide safe, conservative initial first-aid actions.\n\n${JSON_SCHEMA_PROMPT}`;
  } else {
    promptText = `User Description: "${trimmedText}"\n\nPrompt: Provide immediate, practical first-aid and safety guidance based on this campus situation.\n\n${JSON_SCHEMA_PROMPT}`;
  }

  const contents = [promptText];
  if (parsedImage) {
    contents.push({
      inlineData: {
        mimeType: parsedImage.mimeType,
        data: parsedImage.data
      }
    });
  }

  let lastError = null;

  // Try candidate models in order of priority (resilient to 503 / high demand)
  for (const model of UNIQUE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction: SAFETY_SYSTEM_INSTRUCTION,
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const raw = response.text?.trim() || "";
      let parsed;
      try {
        parsed = JSON.parse(raw);
      } catch {
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, raw];
        parsed = JSON.parse(match[1]);
      }

      return sanitizeGuidanceResponse(parsed);
    } catch (err) {
      console.warn(`Model ${model} failed: ${err.message}. Trying next candidate...`);
      lastError = err;
    }
  }

  console.error("All Gemini models failed, falling back to safe offline guidance:", lastError);
  return getOfflineFallback(trimmedText, !!parsedImage);
}

export async function translateGuidance({ content, language }) {
  if (!content || !language) {
    throw new Error("Missing content or target language for translation.");
  }

  const client = getClient();
  if (!client) {
    return content;
  }

  const prompt = `You are a medical and safety translator for SafeAid AI.
Translate the following structured JSON guidance into ${language}.

CRITICAL TRANSLATION RULES:
1. Keep the medical, first-aid, and emergency meaning strictly unchanged and accurate.
2. Keep the numbered structure of "immediate_actions" intact.
3. Keep the JSON keys in English ("situation", "category", "severity", "confidence", "summary", "immediate_actions", "avoid", "when_to_seek_help", "emergency_required", "emergency_reason").
4. Translate ONLY the text values of situation, summary, immediate_actions, avoid, when_to_seek_help, and emergency_reason into ${language}.
5. Do NOT change severity value ("low", "medium", "high", "critical") or category value or boolean values.

JSON to translate:
${JSON.stringify(content, null, 2)}

Return ONLY the translated valid JSON.`;

  for (const model of UNIQUE_MODELS) {
    try {
      const response = await client.models.generateContent({
        model,
        contents: prompt,
        config: {
          systemInstruction: "You are a professional emergency first-aid translator. Return ONLY valid JSON.",
          responseMimeType: "application/json",
          temperature: 0.1
        }
      });

      const raw = response.text?.trim() || "";
      let translated;
      try {
        translated = JSON.parse(raw);
      } catch {
        const match = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, raw];
        translated = JSON.parse(match[1]);
      }

      return sanitizeGuidanceResponse(translated, content);
    } catch (err) {
      console.warn(`Translation with ${model} failed, trying fallback...`);
    }
  }

  return content;
}

function sanitizeGuidanceResponse(data, fallback = {}) {
  const validSeverities = ["low", "medium", "high", "critical"];
  const validCategories = ["medical", "fire", "electrical", "chemical", "environmental", "other"];

  const severity = validSeverities.includes(data.severity?.toLowerCase())
    ? data.severity.toLowerCase()
    : (fallback.severity || "medium");

  const category = validCategories.includes(data.category?.toLowerCase())
    ? data.category.toLowerCase()
    : (fallback.category || "medical");

  return {
    situation: data.situation || fallback.situation || "Campus Safety Assessment",
    category,
    severity,
    confidence: typeof data.confidence === "number" ? Math.min(Math.max(data.confidence, 0.1), 1.0) : 0.88,
    summary: data.summary || fallback.summary || "Preliminary first-aid assessment provided based on observations.",
    immediate_actions: Array.isArray(data.immediate_actions) && data.immediate_actions.length > 0
      ? data.immediate_actions
      : (fallback.immediate_actions || ["1. Keep the affected individual safe and comfortable.", "2. Notify campus medical staff."]),
    avoid: Array.isArray(data.avoid) && data.avoid.length > 0
      ? data.avoid
      : (fallback.avoid || ["Do not administer unauthorized medication.", "Do not delay calling professional help if symptoms worsen."]),
    when_to_seek_help: Array.isArray(data.when_to_seek_help) && data.when_to_seek_help.length > 0
      ? data.when_to_seek_help
      : (fallback.when_to_seek_help || ["Seek immediate medical attention if pain or swelling escalates.", "Contact campus security if hazardous conditions persist."]),
    emergency_required: Boolean(data.emergency_required ?? (severity === "high" || severity === "critical")),
    emergency_reason: data.emergency_reason || (severity === "critical" || severity === "high" ? "High risk situation requiring emergency triage" : "")
  };
}

function getOfflineFallback(text, hasImage) {
  const lower = (text || "").toLowerCase();
  let severity = "low";
  let category = "medical";
  let situation = "Campus First-Aid Assessment";
  let emergency_required = false;

  if (lower.includes("fire") || lower.includes("smoke")) {
    severity = "critical";
    category = "fire";
    situation = "Active Fire or Smoke Hazard";
    emergency_required = true;
  } else if (lower.includes("electric") || lower.includes("wire")) {
    severity = "high";
    category = "electrical";
    situation = "Live Electrical Hazard";
    emergency_required = true;
  } else if (lower.includes("bleed") || lower.includes("blood")) {
    severity = "medium";
    category = "medical";
    situation = "Bleeding Injury";
  } else if (lower.includes("burn")) {
    severity = "low";
    category = "medical";
    situation = "Minor Thermal Burn";
  }

  return {
    situation,
    category,
    severity,
    confidence: 0.88,
    summary: hasImage
      ? `Visual evidence noted with photo uncertainty. ${text || "Initial first-aid safety precautions recommended."}`
      : `Guidance generated for campus safety situation: ${text || "General incident"}`,
    immediate_actions: [
      "1. Ensure the immediate surrounding area is safe before administering aid.",
      "2. Cool the area under clean running water (for burns) or apply gentle pressure with a clean cloth (for bleeding).",
      "3. Keep the individual calm, rested, and monitored."
    ],
    avoid: [
      "Do NOT apply ice directly onto bare skin.",
      "Do NOT use butter, oils, or home substances on open injuries.",
      "Do NOT touch live electrical sources with bare hands."
    ],
    when_to_seek_help: [
      "Seek emergency medical help if breathing becomes difficult or severe pain persists.",
      "Contact Campus Security or 112 if hazard threatens others."
    ],
    emergency_required,
    emergency_reason: emergency_required ? "Potential campus safety or life-threatening hazard identified." : "",
    is_demo: false
  };
}
