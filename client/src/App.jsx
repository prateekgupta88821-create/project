import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import QuickActions from "./components/QuickActions";
import InputCard from "./components/InputCard";
import ResultCard from "./components/ResultCard";
import CampusContacts from "./components/CampusContacts";
import Footer from "./components/Footer";
import EmergencyModal from "./components/EmergencyModal";
import SettingsModal from "./components/SettingsModal";
import DemoModal from "./components/DemoModal";
import { getSettings, saveSettings } from "./utils/storage";

export default function App() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [guidance, setGuidance] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("English");
  const [error, setError] = useState(null);
  const [isConfigured, setIsConfigured] = useState(false);

  // Modals
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isDemoOpen, setIsDemoOpen] = useState(false);

  // Settings
  const [settings, setSettingsState] = useState(getSettings());

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      const res = await fetch("/api/health");
      const data = await res.json();
      setIsConfigured(Boolean(data.configured));
    } catch {
      setIsConfigured(false);
    }
  };

  const handleUpdateSettings = (newSettings) => {
    setSettingsState(newSettings);
    saveSettings(newSettings);
  };

  const handleAnalyze = async () => {
    if (!text.trim() && !image) {
      setError("Please describe what happened or upload a photo.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setCurrentLanguage("English");

    try {
      const payload = {
        text: text.trim(),
        image: image ? image.data : null
      };

      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(
          data.error ||
            "We couldn't analyze the situation right now. If this is an emergency, contact emergency services immediately."
        );
      }

      setGuidance(data.data);

      // If critical severity or emergency required, show emergency modal
      if (data.data.severity === "critical" || data.data.emergency_required) {
        setIsEmergencyOpen(true);
      }

      // Smooth scroll to result
      setTimeout(() => {
        const resultElement = document.getElementById("results-section");
        if (resultElement) {
          resultElement.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } catch (err) {
      setError(
        err.message ||
          "We couldn't analyze the situation right now. If this is an emergency, contact emergency services immediately."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleTranslate = async (language) => {
    if (!guidance || language === "English") return;

    setIsTranslating(true);
    setError(null);

    try {
      const res = await fetch("/api/translate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: guidance,
          language
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Translation failed. Showing original guidance.");
      }

      setGuidance(data.data);
      setCurrentLanguage(language);
    } catch (err) {
      console.error("Translation failed:", err);
      setError("Translation failed. Preserving original medical guidance.");
    } finally {
      setIsTranslating(false);
    }
  };

  const handleSelectScenario = (scenario) => {
    setText(scenario.prompt);
    setImage(null);
    setGuidance(scenario.guidance);
    setCurrentLanguage("English");
    setError(null);

    if (scenario.guidance.severity === "critical" || scenario.guidance.emergency_required) {
      setIsEmergencyOpen(true);
    }

    setTimeout(() => {
      const resultElement = document.getElementById("results-section");
      if (resultElement) {
        resultElement.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
  };

  const handleSelectPrompt = (promptText) => {
    setText(promptText);
    const textarea = document.getElementById("situationText");
    if (textarea) {
      textarea.focus();
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#080d1a] text-slate-100">
      {/* Header */}
      <Header
        onOpenEmergency={() => setIsEmergencyOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isConfigured={isConfigured}
      />

      <main className="flex-1">
        {/* Hero */}
        <Hero onOpenDemo={() => setIsDemoOpen(true)} />

        {/* Quick Incident Topics */}
        <QuickActions onSelectPrompt={handleSelectPrompt} />

        {/* Error Alert Box */}
        {error && (
          <div className="mx-auto max-w-4xl px-4 py-2">
            <div className="flex items-center justify-between rounded-xl border border-red-500/50 bg-red-950/70 p-4 text-xs text-red-200">
              <span>{error}</span>
              <button
                type="button"
                onClick={() => setError(null)}
                className="font-bold text-white hover:underline ml-3"
              >
                Dismiss
              </button>
            </div>
          </div>
        )}

        {/* Input Card */}
        <InputCard
          text={text}
          setText={setText}
          image={image}
          setImage={setImage}
          onAnalyze={handleAnalyze}
          isLoading={isLoading}
          onOpenDemo={() => setIsDemoOpen(true)}
        />

        {/* Guidance Results */}
        <div id="results-section">
          <ResultCard
            guidance={guidance}
            onOpenEmergency={() => setIsEmergencyOpen(true)}
            onTranslate={handleTranslate}
            isTranslating={isTranslating}
            currentLanguage={currentLanguage}
            setCurrentLanguage={setCurrentLanguage}
          />
        </div>

        {/* Campus Contacts Widget */}
        <CampusContacts
          settings={settings}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        settings={settings}
        situationText={text || guidance?.situation}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onSave={handleUpdateSettings}
      />

      <DemoModal
        isOpen={isDemoOpen}
        onClose={() => setIsDemoOpen(false)}
        onSelectScenario={handleSelectScenario}
      />
    </div>
  );
}
