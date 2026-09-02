/**
 * SafeAid - Frontend Client Application
 * Communicates with backend endpoints (/api/analyze, /api/health)
 * Decoupled from Gemini SDK internals.
 */

// Application State
const state = {
  selectedImageBase64: null,
  selectedImageMime: null,
  selectedImageFilename: null,
  isAnalyzing: false,
  apiConfigured: false
};

// DOM Elements
const healthForm = document.getElementById("healthForm");
const symptomTextInput = document.getElementById("symptomTextInput");
const imageFileInput = document.getElementById("imageFileInput");
const dropzone = document.getElementById("dropzone");
const dropzoneEmpty = document.getElementById("dropzoneEmpty");
const dropzonePreview = document.getElementById("dropzonePreview");
const previewImage = document.getElementById("previewImage");
const previewFilename = document.getElementById("previewFilename");
const removeImageBtn = document.getElementById("removeImageBtn");
const languageSelect = document.getElementById("languageSelect");
const analyzeBtn = document.getElementById("analyzeBtn");
const clearBtn = document.getElementById("clearBtn");

// Status and Output DOM Elements
const statusDot = document.getElementById("statusDot");
const statusLabel = document.getElementById("statusLabel");
const emptyState = document.getElementById("emptyState");
const loadingState = document.getElementById("loadingState");
const loadingTitle = document.getElementById("loadingTitle");
const languagePromptCard = document.getElementById("languagePromptCard");
const languageButtonsGrid = document.getElementById("languageButtonsGrid");
const resultsContent = document.getElementById("resultsContent");
const urgencyBadge = document.getElementById("urgencyBadge");
const langBadge = document.getElementById("langBadge");
const emergencyCallout = document.getElementById("emergencyCallout");
const emergencyAdviceText = document.getElementById("emergencyAdviceText");
const visualNoteBox = document.getElementById("visualNoteBox");
const visualObservationsText = document.getElementById("visualObservationsText");
const possibleConditionsList = document.getElementById("possibleConditionsList");
const firstAidStepsList = document.getElementById("firstAidStepsList");
const whatNotToDoList = document.getElementById("whatNotToDoList");
const whenToSeekDoctorList = document.getElementById("whenToSeekDoctorList");
const disclaimerText = document.getElementById("disclaimerText");
const errorCard = document.getElementById("errorCard");
const errorTitle = document.getElementById("errorTitle");
const errorMessage = document.getElementById("errorMessage");
const errorRetryBtn = document.getElementById("errorRetryBtn");

// Quick Topic Buttons
const quickTagBtns = document.querySelectorAll(".tag-btn");

/**
 * Initialize Application
 */
async function initApp() {
  bindEvents();
  await checkApiHealth();
}

/**
 * Check backend Gemini API health check endpoint safely
 */
async function checkApiHealth() {
  try {
    const res = await fetch("/api/health");
    const data = await res.json();

    if (data.configured) {
      state.apiConfigured = true;
      statusDot.className = "status-dot active";
      statusLabel.textContent = `Gemini Online (${data.model || "gemini-2.5-flash"})`;
      statusLabel.title = "Google Gemini API connected and ready";
    } else {
      state.apiConfigured = false;
      statusDot.className = "status-dot unconfigured";
      statusLabel.textContent = "Offline Demo Mode (Key Unset)";
      statusLabel.title = "Set GEMINI_API_KEY in .env for live Gemini AI inference";
    }
  } catch (err) {
    statusDot.className = "status-dot error";
    statusLabel.textContent = "Backend Offline";
  }
}

/**
 * Bind UI event listeners
 */
function bindEvents() {
  // Quick symptom tag clicks
  quickTagBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      symptomTextInput.value = btn.getAttribute("data-symptom") || "";
      symptomTextInput.focus();
    });
  });

  // Dropzone click & drag-and-drop
  dropzone.addEventListener("click", (e) => {
    if (e.target !== removeImageBtn && !removeImageBtn.contains(e.target)) {
      imageFileInput.click();
    }
  });

  dropzone.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      imageFileInput.click();
    }
  });

  dropzone.addEventListener("dragover", (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });

  dropzone.addEventListener("dragleave", () => {
    dropzone.classList.remove("dragover");
  });

  dropzone.addEventListener("drop", (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleImageFile(files[0]);
    }
  });

  imageFileInput.addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageFile(file);
    }
  });

  removeImageBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    clearImage();
  });

  // Form submit
  healthForm.addEventListener("submit", (e) => {
    e.preventDefault();
    performAnalysis();
  });

  // Clear button
  clearBtn.addEventListener("click", () => {
    resetForm();
  });

  // Error retry
  errorRetryBtn.addEventListener("click", () => {
    showView("empty");
  });
}

/**
 * Process and preview uploaded image file
 */
function handleImageFile(file) {
  const validTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/heic"];
  if (!validTypes.includes(file.type.toLowerCase())) {
    showError(
      "Unsupported File Format",
      `"${file.name}" is not a supported image. Please upload a JPEG, PNG, or WEBP image.`
    );
    return;
  }

  // Max 10MB client check
  if (file.size > 10 * 1024 * 1024) {
    showError(
      "Image Too Large",
      "Please upload an image smaller than 10MB for optimal Gemini multimodal processing."
    );
    return;
  }

  const reader = new FileReader();
  reader.onload = (e) => {
    const dataUrl = e.target.result;
    state.selectedImageBase64 = dataUrl;
    state.selectedImageMime = file.type;
    state.selectedImageFilename = file.name;

    previewImage.src = dataUrl;
    previewFilename.textContent = file.name;

    dropzoneEmpty.classList.add("hidden");
    dropzonePreview.classList.remove("hidden");
  };
  reader.onerror = () => {
    showError("File Error", "Could not read the selected image file. Please try again.");
  };
  reader.readAsDataURL(file);
}

/**
 * Remove selected image
 */
function clearImage() {
  state.selectedImageBase64 = null;
  state.selectedImageMime = null;
  state.selectedImageFilename = null;
  imageFileInput.value = "";
  previewImage.src = "";

  dropzonePreview.classList.add("hidden");
  dropzoneEmpty.classList.remove("hidden");
}

/**
 * Reset entire form
 */
function resetForm() {
  symptomTextInput.value = "";
  languageSelect.value = "";
  clearImage();
  showView("empty");
}

/**
 * Manage View States in Output Card
 */
function showView(viewName) {
  emptyState.classList.add("hidden");
  loadingState.classList.add("hidden");
  languagePromptCard.classList.add("hidden");
  resultsContent.classList.add("hidden");
  errorCard.classList.add("hidden");

  if (viewName === "empty") emptyState.classList.remove("hidden");
  if (viewName === "loading") loadingState.classList.remove("hidden");
  if (viewName === "languagePrompt") languagePromptCard.classList.remove("hidden");
  if (viewName === "results") resultsContent.classList.remove("hidden");
  if (viewName === "error") errorCard.classList.remove("hidden");
}

/**
 * Execute Health Input Analysis via server endpoint
 */
async function performAnalysis(overrideLanguage = null) {
  const text = symptomTextInput.value.trim();
  const image = state.selectedImageBase64;
  const preferredLanguage = overrideLanguage !== null ? overrideLanguage : languageSelect.value;

  if (!text && !image) {
    showError("Missing Information", "Please describe symptoms in text, upload a photo, or provide both.");
    return;
  }

  state.isAnalyzing = true;
  analyzeBtn.disabled = true;
  showView("loading");

  if (image && !text) {
    loadingTitle.textContent = "Analyzing injury image with Gemini Vision...";
  } else if (image && text) {
    loadingTitle.textContent = "Evaluating multimodal text & image with Gemini...";
  } else {
    loadingTitle.textContent = "Evaluating first-aid symptoms with Gemini...";
  }

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        text,
        image,
        preferredLanguage
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `Server responded with status ${response.status}`);
    }

    // REQUIREMENT 17:
    // If only image was provided and preferredLanguage was missing,
    // server returns needsLanguagePreference = true with the question.
    if (data.needsLanguagePreference) {
      renderLanguagePrompt(data);
      return;
    }

    // Render structured results
    renderResults(data);
  } catch (err) {
    showError("Analysis Failed", err.message);
  } finally {
    state.isAnalyzing = false;
    analyzeBtn.disabled = false;
  }
}

/**
 * Render Interactive Language Selection Request (Requirement 17)
 */
function renderLanguagePrompt(data) {
  showView("languagePrompt");

  const heading = document.getElementById("promptHeading");
  heading.textContent = data.prompt || "Which language would you prefer for the explanation and guidance?";

  languageButtonsGrid.innerHTML = "";

  const languages = data.availableLanguages || [
    { code: "en", name: "English" },
    { code: "es", name: "Español (Spanish)" },
    { code: "hi", name: "हिन्दी (Hindi)" },
    { code: "fr", name: "Français (French)" },
    { code: "ar", name: "العربية (Arabic)" },
    { code: "zh", name: "中文 (Mandarin)" },
    { code: "de", name: "Deutsch (German)" }
  ];

  languages.forEach((lang) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "btn-lang-choice";
    btn.textContent = lang.nativeName ? `${lang.nativeName} (${lang.name})` : lang.name;
    btn.addEventListener("click", () => {
      // Set the language selector value for consistency
      languageSelect.value = lang.name;
      // Re-trigger analysis with selected language preference immediately (Requirement 18)
      performAnalysis(lang.name);
    });
    languageButtonsGrid.appendChild(btn);
  });
}

/**
 * Render Structured Results
 */
function renderResults(data) {
  showView("results");

  // Urgency level badge
  const urgency = (data.urgencyLevel || "routine_first_aid").toLowerCase();
  urgencyBadge.className = `urgency-badge ${urgency}`;
  urgencyBadge.textContent = formatUrgencyTitle(urgency);

  // Language pill
  langBadge.textContent = data.responseLanguage || data.detectedLanguage || "English";

  // Emergency Callout
  if (data.isEmergency || urgency === "emergency" || data.emergencyAdvice) {
    emergencyCallout.classList.remove("hidden");
    emergencyAdviceText.textContent =
      data.emergencyAdvice ||
      "Emergency situation identified. Contact local emergency services immediately (911/112/999).";
  } else {
    emergencyCallout.classList.add("hidden");
  }

  // Visual Observation Note
  if (data.visualObservations) {
    visualNoteBox.classList.remove("hidden");
    visualObservationsText.textContent = data.visualObservations;
  } else {
    visualNoteBox.classList.add("hidden");
  }

  // Possible Conditions (Non-diagnostic)
  possibleConditionsList.innerHTML = "";
  if (data.possibleConditions && data.possibleConditions.length > 0) {
    data.possibleConditions.forEach((c) => {
      const li = document.createElement("li");
      li.textContent = c;
      possibleConditionsList.appendChild(li);
    });
  } else {
    const li = document.createElement("li");
    li.textContent = "No specific conditions identified. Monitor for changes.";
    possibleConditionsList.appendChild(li);
  }

  // Step-by-Step Remedies
  firstAidStepsList.innerHTML = "";
  if (data.firstAidSteps && data.firstAidSteps.length > 0) {
    data.firstAidSteps.forEach((step) => {
      const li = document.createElement("li");
      // Strip leading digits if already formatted by model
      li.textContent = step.replace(/^\d+[\.\)]\s*/, "");
      firstAidStepsList.appendChild(li);
    });
  }

  // Critical Precautions (What NOT to do)
  whatNotToDoList.innerHTML = "";
  if (data.whatNotToDo && data.whatNotToDo.length > 0) {
    data.whatNotToDo.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      whatNotToDoList.appendChild(li);
    });
  }

  // When to consult doctor
  whenToSeekDoctorList.innerHTML = "";
  if (data.whenToSeekDoctor && data.whenToSeekDoctor.length > 0) {
    data.whenToSeekDoctor.forEach((item) => {
      const li = document.createElement("li");
      li.textContent = item;
      whenToSeekDoctorList.appendChild(li);
    });
  }

  // Disclaimer text
  disclaimerText.textContent =
    data.disclaimer ||
    "SafeAid is an educational first-aid assistant and not a substitute for professional clinical medical advice, diagnosis, or emergency care.";
}

function formatUrgencyTitle(urgency) {
  switch (urgency) {
    case "emergency":
      return "🚨 Critical Emergency";
    case "urgent":
      return "⚠️ Urgent Medical Attention";
    case "routine_first_aid":
      return "🩹 Routine First-Aid";
    case "self_care":
      return "🌱 Mild / Self-Care";
    default:
      return "First-Aid Guidance";
  }
}

/**
 * Display Error Message Card
 */
function showError(title, message) {
  showView("error");
  errorTitle.textContent = title;
  errorMessage.textContent = message;
}

// Start application when DOM loaded
document.addEventListener("DOMContentLoaded", initApp);
