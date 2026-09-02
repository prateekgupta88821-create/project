/**
 * SafeAid - Google Gemini API Integration Test Suite
 * Validates text-only, image-only (with & without preferredLanguage),
 * text + image, invalid image handling, safety disclaimers, and health check.
 */

import {
  analyzeHealthInput,
  testGeminiHealth,
  parseAndValidateImage,
  SUPPORTED_LANGUAGES,
  MEDICAL_SAFETY_DISCLAIMER
} from "../server/geminiService.js";

// Sample 1x1 transparent PNG in base64
const VALID_SAMPLE_PNG_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";

let testsPassed = 0;
let testsFailed = 0;

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ FAIL: ${message}`);
    testsFailed++;
    throw new Error(message);
  } else {
    console.log(`✅ PASS: ${message}`);
    testsPassed++;
  }
}

async function runTests() {
  console.log("\n=======================================================");
  console.log("🧪 Starting SafeAid Google Gemini Integration Tests");
  console.log("=======================================================\n");

  // TEST 1: Health Check without exposing API key (Requirement 13)
  try {
    console.log("--- Test 1: testGeminiHealth() check ---");
    const health = await testGeminiHealth();
    assert(health !== null && typeof health === "object", "Health check returns an object");
    assert("configured" in health, "Health check contains 'configured' boolean flag");
    assert("model" in health, "Health check contains 'model' string");
    assert(health.apiKey === undefined, "Health check NEVER exposes GEMINI_API_KEY");
  } catch (err) {
    console.error("Test 1 error:", err.message);
  }

  // TEST 2: Image-only input WITHOUT preferredLanguage (Requirement 17)
  // MUST ask: "Which language would you prefer for the explanation and guidance?"
  try {
    console.log("\n--- Test 2: Image-only input without preferredLanguage (Req 17) ---");
    const result = await analyzeHealthInput({
      image: VALID_SAMPLE_PNG_BASE64,
      text: "",
      preferredLanguage: ""
    });

    assert(result.needsLanguagePreference === true, "Returned needsLanguagePreference === true");
    assert(
      result.prompt === "Which language would you prefer for the explanation and guidance?",
      `Returned exact required prompt: "${result.prompt}"`
    );
    assert(Array.isArray(result.availableLanguages), "Returned list of availableLanguages");
  } catch (err) {
    console.error("Test 2 error:", err.message);
  }

  // TEST 3: Image-only input WITH preferredLanguage (Requirement 18)
  try {
    console.log("\n--- Test 3: Image-only input with preferredLanguage (Req 18) ---");
    const result = await analyzeHealthInput({
      image: VALID_SAMPLE_PNG_BASE64,
      text: "",
      preferredLanguage: "Spanish"
    });

    assert(result.needsLanguagePreference === false, "Returned needsLanguagePreference === false");
    assert(
      result.responseLanguage === "Español" || result.responseLanguage === "Spanish",
      `Maintains requested response language: ${result.responseLanguage}`
    );
    assert(Array.isArray(result.firstAidSteps), "Provides firstAidSteps array");
    assert(result.disclaimer !== undefined, "Includes safety disclaimer");
  } catch (err) {
    console.error("Test 3 error:", err.message);
  }

  // TEST 4: Text-only input (Requirement 16)
  try {
    console.log("\n--- Test 4: Text-only input (Req 16) ---");
    const result = await analyzeHealthInput({
      text: "I accidentally spilled hot tea on my wrist, it is red and stinging. What should I do?",
      image: null,
      preferredLanguage: "English"
    });

    assert(result.needsLanguagePreference === false, "needsLanguagePreference is false for text input");
    assert(result.firstAidSteps.length > 0, "Returns actionable first aid steps");
    assert(result.whatNotToDo.length > 0, "Returns critical 'what NOT to do' precautions");
    assert(result.whenToSeekDoctor.length > 0, "Returns medical triage guidance");
    assert(typeof result.disclaimer === "string", "Includes medical disclaimer");
  } catch (err) {
    console.error("Test 4 error:", err.message);
  }

  // TEST 5: Text + Image input together (Requirement 14 & 16)
  try {
    console.log("\n--- Test 5: Text + Image input combined (Req 14 & 16) ---");
    const result = await analyzeHealthInput({
      text: "Scraped my knee on gravel while riding a bicycle.",
      image: {
        data: VALID_SAMPLE_PNG_BASE64,
        mimeType: "image/png"
      },
      preferredLanguage: "English"
    });

    assert(result.needsLanguagePreference === false, "Combined input returns complete response");
    assert(result.firstAidSteps.length > 0, "Returns first aid steps for combined input");
    assert(result.possibleConditions.length > 0, "Returns non-diagnostic possible conditions");
  } catch (err) {
    console.error("Test 5 error:", err.message);
  }

  // TEST 6: Invalid image format handling (Requirement 11)
  try {
    console.log("\n--- Test 6: Invalid/unsupported image handling (Req 11) ---");
    let caughtError = null;
    try {
      parseAndValidateImage({
        data: "not-an-image-data",
        mimeType: "application/pdf"
      });
    } catch (e) {
      caughtError = e;
    }
    assert(caughtError !== null, "Invalid mimeType throws validation error");
    assert(
      caughtError.message.includes("Unsupported image type"),
      "Error specifies unsupported format"
    );
  } catch (err) {
    console.error("Test 6 error:", err.message);
  }

  // TEST 7: Empty input validation
  try {
    console.log("\n--- Test 7: Empty input rejection ---");
    let caughtError = null;
    try {
      await analyzeHealthInput({ text: "", image: null });
    } catch (e) {
      caughtError = e;
    }
    assert(caughtError !== null, "Rejects completely empty input");
  } catch (err) {
    console.error("Test 7 error:", err.message);
  }

  // TEST 8: Safety Requirement checks (Requirement 15)
  try {
    console.log("\n--- Test 8: Medical safety rules verification (Req 15) ---");
    const result = await analyzeHealthInput({
      text: "Severe chest pain radiating to left arm and shortness of breath.",
      preferredLanguage: "English"
    });

    assert(result.disclaimer.length > 20, "Contains comprehensive medical safety disclaimer");
    assert(
      result.disclaimer.includes("not a replacement") || result.disclaimer.includes("informational"),
      "Explicitly clarifies that SafeAid is not a replacement for professional diagnosis"
    );
  } catch (err) {
    console.error("Test 8 error:", err.message);
  }

  console.log("\n=======================================================");
  console.log(`📊 Test Results: ${testsPassed} Passed, ${testsFailed} Failed`);
  console.log("=======================================================\n");

  if (testsFailed > 0) {
    process.exit(1);
  } else {
    process.exit(0);
  }
}

runTests();
