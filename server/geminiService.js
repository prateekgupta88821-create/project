import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Supported response languages with human-readable names and native labels
export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English" },
  { code: "es", name: "Spanish", nativeName: "Español" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी" },
  { code: "fr", name: "French", nativeName: "Français" },
  { code: "ar", name: "Arabic", nativeName: "العربية" },
  { code: "zh", name: "Mandarin Chinese", nativeName: "中文" },
  { code: "de", name: "German", nativeName: "Deutsch" },
  { code: "pt", name: "Portuguese", nativeName: "Português" },
  { code: "ru", name: "Russian", nativeName: "Русский" },
  { code: "ja", name: "Japanese", nativeName: "日本語" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা" }
];

export const SUPPORTED_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/gif"
];

// Fallback safety disclaimer constant
export const MEDICAL_SAFETY_DISCLAIMER =
  "SafeAid is an informational first-aid and health-assistance tool only. It is not a replacement for professional medical advice, clinical diagnosis, or emergency healthcare services. In life-threatening emergencies, immediately contact your local emergency services (e.g., 911, 112, 999).";

/**
 * Helper to retrieve an initialized GoogleGenAI client using process.env.GEMINI_API_KEY.
 * Never hard-codes or exposes the key.
 */
export function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return null;
  }
  return new GoogleGenAI({ apiKey });
}

/**
 * Validates and normalizes input image into base64 data and mimeType
 */
export function parseAndValidateImage(image) {
  if (!image) return null;

  let mimeType = "image/jpeg";
  let base64Data = "";

  if (typeof image === "string") {
    // Check if it's a data URL (e.g. data:image/png;base64,...)
    const dataUrlMatch = image.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (dataUrlMatch) {
      mimeType = dataUrlMatch[1].toLowerCase();
      base64Data = dataUrlMatch[2].trim();
    } else {
      // Raw base64 string
      base64Data = image.trim();
    }
  } else if (typeof image === "object" && image.data) {
    base64Data = typeof image.data === "string" ? image.data.trim() : "";
    if (image.mimeType) {
      mimeType = image.mimeType.toLowerCase();
    }
    // If the data itself was a data URL
    const match = base64Data.match(/^data:([a-zA-Z0-9]+\/[a-zA-Z0-9-.+]+);base64,(.+)$/);
    if (match) {
      mimeType = match[1].toLowerCase();
      base64Data = match[2].trim();
    }
  } else {
    throw new Error("Invalid image format. Expected a base64 string or an object with { data, mimeType }.");
  }

  // Normalize jpg to jpeg
  if (mimeType === "image/jpg") {
    mimeType = "image/jpeg";
  }

  if (!SUPPORTED_MIME_TYPES.includes(mimeType)) {
    throw new Error(`Unsupported image type "${mimeType}". Supported formats are JPEG, PNG, WEBP, HEIC, and GIF.`);
  }

  if (!base64Data || base64Data.length < 10) {
    throw new Error("Invalid or empty image data provided.");
  }

  // Basic base64 validation
  const base64Regex = /^[A-Za-z0-9+/=]+$/;
  const cleanData = base64Data.replace(/\s/g, "");
  if (!base64Regex.test(cleanData)) {
    throw new Error("Image data is not valid base64.");
  }

  return { mimeType, data: cleanData };
}

/**
 * System instruction enforcing SafeAid clinical safety rules, emergency triage,
 * and multilingual first-aid guidance.
 */
function buildSystemInstruction(requestedLanguage) {
  return `You are SafeAid, an empathetic, highly knowledgeable, and safety-focused first-aid assistant.
Your purpose is to provide immediate, clear, practical first-aid guidance, symptom assessment, and triage recommendations.

CRITICAL MEDICAL SAFETY RULES:
1. SafeAid is an informational health assistant, NEVER a replacement for a doctor or professional medical diagnosis.
2. Clearly distinguish possible conditions from confirmed diagnoses. Always phrase as "Possible considerations to discuss with a physician", NEVER "You have X".
3. AVOID claiming certainty from an image. Images cannot verify severity or internal complications. Always state image limitations clearly.
4. ALWAYS recommend professional medical consultation when symptoms are non-trivial, worsening, or persistent.
5. Identify potential emergencies (e.g., severe bleeding, chest pain, anaphylaxis, head trauma, breathing difficulty, severe burns) immediately and advise calling emergency services (such as 911, 112, 999).
6. NEVER prescribe medication dosages or advise dangerous, unproven, or invasive home remedies (e.g., do not advise putting butter on burns, applying ice directly to bare skin, or inducing vomiting for poisoning unless directed by poison control).
7. Respond STRICTLY in the requested language: "${requestedLanguage || 'English'}". Ensure all medical terms, steps, and warnings are clearly expressed in this language.

You MUST respond strictly with a valid JSON object following this exact schema:
{
  "detectedLanguage": "The language detected from user text, or the language chosen",
  "responseLanguage": "${requestedLanguage || 'English'}",
  "urgencyLevel": "emergency" | "urgent" | "routine_first_aid" | "self_care",
  "isEmergency": true | false,
  "emergencyAdvice": "Short urgent action if emergency, e.g. Call local emergency services immediately (911/112/999).",
  "disclaimer": "${MEDICAL_SAFETY_DISCLAIMER}",
  "visualObservations": "Objective observations of the image, clearly stating that images cannot replace clinical exam",
  "possibleConditions": ["Condition 1 (Possible)", "Condition 2 (Possible)"],
  "firstAidSteps": ["1. Immediate step...", "2. Next step...", "3. Dressing/care..."],
  "whatNotToDo": ["Do NOT do X...", "Avoid doing Y..."],
  "whenToSeekDoctor": ["Seek immediate emergency care if...", "Consult a doctor if symptoms persist over 24-48 hours..."],
  "generalRemedyGuidance": "A summary of home comfort and recovery guidance"
}`;
}

/**
 * Reusable function to analyze health input with text, image, or text + image.
 *
 * @param {Object} params
 * @param {string} [params.text] - The user's text description of symptoms or injury
 * @param {string|Object} [params.image] - Base64 image data or { data, mimeType }
 * @param {string} [params.preferredLanguage] - Target language (e.g. "English", "Spanish", "hi")
 * @returns {Promise<Object>} Structured first-aid guidance or language preference prompt
 */
export async function analyzeHealthInput({ text = "", image = null, preferredLanguage = "" }) {
  const trimmedText = typeof text === "string" ? text.trim() : "";
  const hasText = trimmedText.length > 0;
  let parsedImage = null;

  // Validate image if provided
  if (image) {
    parsedImage = parseAndValidateImage(image);
  }

  const hasImage = !!parsedImage;

  // Validate that at least text or image is provided
  if (!hasText && !hasImage) {
    throw new Error("Please provide a symptom description, an image, or both.");
  }

  // Normalize preferred language
  let targetLang = typeof preferredLanguage === "string" ? preferredLanguage.trim() : "";
  if (targetLang.toLowerCase() === "auto" || targetLang.toLowerCase() === "none") {
    targetLang = "";
  }

  // Resolve language code to full language name if code provided (e.g., 'es' -> 'Spanish')
  const matchedLang = SUPPORTED_LANGUAGES.find(
    (l) => l.code.toLowerCase() === targetLang.toLowerCase() || l.name.toLowerCase() === targetLang.toLowerCase()
  );
  if (matchedLang) {
    targetLang = matchedLang.name;
  }

  // REQUIREMENT 17:
  // "When image-only input is received and preferredLanguage is missing, return a response asking:
  // 'Which language would you prefer for the explanation and guidance?'"
  if (hasImage && !hasText && !targetLang) {
    return {
      needsLanguagePreference: true,
      prompt: "Which language would you prefer for the explanation and guidance?",
      message: "Which language would you prefer for the explanation and guidance?",
      availableLanguages: SUPPORTED_LANGUAGES,
      imageReceived: true,
      hint: "Please select your preferred language below so SafeAid can provide accurate, tailored first-aid guidance."
    };
  }

  // Default target language if none specified and text is available
  const effectiveLanguage = targetLang || "English (or the language matching the user's text description)";

  // Check if GEMINI_API_KEY is configured
  const client = getGeminiClient();
  if (!client) {
    // If no API key is configured yet, provide a mock/offline structured response
    // so tests and UI can safely showcase functionality without crashing.
    return generateOfflineMockResponse({
      text: trimmedText,
      hasImage,
      preferredLanguage: targetLang || "English"
    });
  }

  // Prepare Gemini Request
  const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  try {
    const contents = [];

    // Construct prompt
    let userPrompt = "";
    if (hasText && hasImage) {
      userPrompt = `The user has provided both a text description and an image of their health concern/injury.
User Description: "${trimmedText}"
Preferred Response Language: ${effectiveLanguage}

Analyze the image and description carefully. Identify possible first-aid concerns, outline step-by-step first-aid remedies, highlight critical precautions (what NOT to do), and clearly outline emergency red flags. Follow all safety guidelines strictly.`;
    } else if (hasImage) {
      userPrompt = `The user has provided an image of their health concern/injury.
Preferred Response Language: ${effectiveLanguage}

Inspect the visual evidence. Note that visual inspection via a photo is inherently limited and cannot constitute a diagnosis. Identify possible first-aid issues, provide immediate safe first-aid remedies, precautions, and when to seek urgent medical care. Follow all safety guidelines strictly.`;
    } else {
      userPrompt = `The user has described their health concern/symptoms:
"${trimmedText}"
Preferred Response Language: ${effectiveLanguage}

Provide immediate first-aid guidance, practical safe remedies, precautions (what NOT to do), and clear triage advice. Follow all safety guidelines strictly.`;
    }

    contents.push(userPrompt);

    // Attach multimodal image part if present
    if (hasImage) {
      contents.push({
        inlineData: {
          mimeType: parsedImage.mimeType,
          data: parsedImage.data
        }
      });
    }

    const response = await client.models.generateContent({
      model: modelName,
      contents,
      config: {
        systemInstruction: buildSystemInstruction(effectiveLanguage),
        responseMimeType: "application/json",
        temperature: 0.2
      }
    });

    const rawText = response.text?.trim() || "";
    let parsedResult;

    try {
      parsedResult = JSON.parse(rawText);
    } catch {
      // Fallback in case response had surrounding markdown fences
      const jsonMatch = rawText.match(/```(?:json)?\s*([\s\S]*?)\s*```/) || [null, rawText];
      parsedResult = JSON.parse(jsonMatch[1]);
    }

    // Ensure essential safety fields exist
    return {
      needsLanguagePreference: false,
      detectedLanguage: parsedResult.detectedLanguage || effectiveLanguage,
      responseLanguage: parsedResult.responseLanguage || effectiveLanguage,
      urgencyLevel: parsedResult.urgencyLevel || "routine_first_aid",
      isEmergency: !!parsedResult.isEmergency,
      emergencyAdvice: parsedResult.emergencyAdvice || null,
      disclaimer: parsedResult.disclaimer || MEDICAL_SAFETY_DISCLAIMER,
      visualObservations: parsedResult.visualObservations || (hasImage ? "Visual analysis conducted with inherent image-based uncertainty." : null),
      possibleConditions: Array.isArray(parsedResult.possibleConditions) ? parsedResult.possibleConditions : [],
      firstAidSteps: Array.isArray(parsedResult.firstAidSteps) ? parsedResult.firstAidSteps : [],
      whatNotToDo: Array.isArray(parsedResult.whatNotToDo) ? parsedResult.whatNotToDo : [],
      whenToSeekDoctor: Array.isArray(parsedResult.whenToSeekDoctor) ? parsedResult.whenToSeekDoctor : [],
      generalRemedyGuidance: parsedResult.generalRemedyGuidance || ""
    };
  } catch (error) {
    // Handle API rate limits gracefully (Requirement 11)
    if (error?.status === 429 || error?.message?.includes("RESOURCE_EXHAUSTED") || error?.message?.includes("rate limit")) {
      const rateLimitError = new Error(
        "The Google Gemini API rate limit has been reached. Please wait a few seconds and try again. For severe or life-threatening symptoms, do not wait—contact local emergency services (911/112/999) immediately."
      );
      rateLimitError.isRateLimit = true;
      rateLimitError.status = 429;
      throw rateLimitError;
    }

    // Handle invalid image / argument error from API
    if (error?.message?.includes("INVALID_ARGUMENT") || error?.message?.includes("image")) {
      const imageError = new Error("The uploaded image could not be processed by the Gemini model. Please try another clear JPEG or PNG image.");
      imageError.status = 400;
      throw imageError;
    }

    // Rethrow with clean message
    throw new Error(`Gemini API Error: ${error?.message || "An unexpected error occurred while analyzing health input."}`);
  }
}

/**
 * Simple health/test check for the integration without exposing any API key.
 *
 * @returns {Promise<Object>} Status of API configuration and connectivity
 */
export async function testGeminiHealth() {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  const configured = !!apiKey && apiKey !== "your_gemini_api_key_here";
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";

  if (!configured) {
    return {
      status: "unconfigured",
      configured: false,
      model,
      message: "GEMINI_API_KEY is not configured. Please set a valid key in your .env file."
    };
  }

  try {
    const client = getGeminiClient();
    // Test connectivity with a minimal ping prompt
    const response = await client.models.generateContent({
      model,
      contents: "Respond with the word 'OK'.",
      config: {
        maxOutputTokens: 10,
        temperature: 0.1
      }
    });

    const text = response.text?.trim() || "";
    return {
      status: "healthy",
      configured: true,
      model,
      pingResponse: text.includes("OK") ? "OK" : text
    };
  } catch (err) {
    return {
      status: "error",
      configured: true,
      model,
      error: err?.message || "Failed to communicate with Gemini API"
    };
  }
}

/**
 * Generates an informative offline demonstration response when GEMINI_API_KEY is unconfigured.
 */
function generateOfflineMockResponse({ text, hasImage, preferredLanguage }) {
  const isSpanish = preferredLanguage.toLowerCase().includes("span") || preferredLanguage.toLowerCase() === "es";
  const isHindi = preferredLanguage.toLowerCase().includes("hind") || preferredLanguage.toLowerCase() === "hi";

  if (isSpanish) {
    return {
      needsLanguagePreference: false,
      detectedLanguage: "Español",
      responseLanguage: "Español",
      urgencyLevel: "routine_first_aid",
      isEmergency: false,
      emergencyAdvice: null,
      disclaimer: "SafeAid es únicamente una herramienta informativa de primeros auxilios. No sustituye la atención médica profesional ni los servicios de urgencias.",
      visualObservations: hasImage ? "Observación visual preliminar sujeta a incertidumbre inherente a las imágenes." : null,
      possibleConditions: ["Lesión o afección leve que requiere primeros auxilios"],
      firstAidSteps: [
        "1. Lave suavemente el área afectada con agua limpia y fresca.",
        "2. Aplique presión suave con un paño limpio si hay sangrado leve.",
        "3. Mantenga el área limpia y protegida con un vendaje estéril."
      ],
      whatNotToDo: [
        "No aplique hielo directamente sobre la piel.",
        "No reviente ampollas ni aplique ungüentos no prescritos en quemaduras abiertas."
      ],
      whenToSeekDoctor: [
        "Consulte a un médico si el dolor empeora significativamente.",
        "Busque atención urgente si observa signos de infección como calor, pus o fiebre."
      ],
      generalRemedyGuidance: "Descanse y mantenga la zona protegida.",
      note: "Modo de demostración fuera de línea: Configure GEMINI_API_KEY en .env para análisis en vivo con Gemini."
    };
  }

  if (isHindi) {
    return {
      needsLanguagePreference: false,
      detectedLanguage: "हिन्दी",
      responseLanguage: "हिन्दी",
      urgencyLevel: "routine_first_aid",
      isEmergency: false,
      emergencyAdvice: null,
      disclaimer: "SafeAid केवल एक सूचनात्मक प्राथमिक उपचार उपकरण है और डॉक्टर या आपातकालीन सेवाओं का विकल्प नहीं है।",
      visualObservations: hasImage ? "तस्वीर के आधार पर प्रारंभिक अवलोकन, जो डॉक्टर की जांच का स्थान नहीं ले सकता।" : null,
      possibleConditions: ["प्राथमिक उपचार योग्य सामान्य चोट या समस्या"],
      firstAidSteps: [
        "1. प्रभावित हिस्से को साफ और ठंडे पानी से धीरे से धोएं।",
        "2. यदि हल्का रक्तस्राव हो तो साफ कपड़े से हल्का दबाव डालें।",
        "3. क्षेत्र को साफ रखें और रोगाणुरहित पट्टी से ढकें।"
      ],
      whatNotToDo: [
        "त्वचा पर सीधे बर्फ न लगाएं।",
        "फफोले न फोड़ें और बिना डॉक्टर की सलाह के कोई दवा न लें।"
      ],
      whenToSeekDoctor: [
        "यदि दर्द या सूजन लगातार बढ़ रही हो तो तुरंत डॉक्टर से संपर्क करें।",
        "संक्रमण के लक्षण (जैसे मवाद या बुखार) दिखने पर चिकित्सीय सहायता लें।"
      ],
      generalRemedyGuidance: "आराम करें और प्रभावित अंग को सुरक्षित रखें।",
      note: "ऑफ़लाइन प्रदर्शन मोड: लाइव जेमिनी विश्लेषण के लिए .env में GEMINI_API_KEY कॉन्फ़िगर करें।"
    };
  }

  return {
    needsLanguagePreference: false,
    detectedLanguage: "English",
    responseLanguage: preferredLanguage || "English",
    urgencyLevel: "routine_first_aid",
    isEmergency: false,
    emergencyAdvice: null,
    disclaimer: MEDICAL_SAFETY_DISCLAIMER,
    visualObservations: hasImage ? "Preliminary visual observation subject to inherent image uncertainty. Not a clinical diagnosis." : null,
    possibleConditions: ["Mild injury or superficial condition suitable for initial first-aid"],
    firstAidSteps: [
      "1. Clean the affected area gently with cool running water or mild saline.",
      "2. Apply gentle, steady pressure with a clean, lint-free cloth if mild bleeding is present.",
      "3. Protect the area with a clean, breathable sterile dressing.",
      "4. Elevate the affected limb if swelling is a concern."
    ],
    whatNotToDo: [
      "Do NOT apply ice directly onto bare skin.",
      "Do NOT puncture or pop blisters.",
      "Do NOT apply butter, oils, or unverified home substances to burns."
    ],
    whenToSeekDoctor: [
      "Seek emergency medical attention if you experience severe pain, spreading redness, numbness, or difficulty breathing.",
      "Consult a healthcare professional if symptoms persist or show signs of infection (increased warmth, pus, fever)."
    ],
    generalRemedyGuidance: "Rest, monitor closely, and keep the wound clean and dry.",
    note: "Offline Demonstration Mode: Configure GEMINI_API_KEY in .env to activate live Gemini AI inference."
  };
}
