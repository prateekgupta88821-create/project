import React from "react";
import { Shield } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-800/80 py-8 text-center text-xs text-slate-500">
      <div className="mx-auto flex max-w-4xl flex-col items-center justify-center gap-2 px-4">
        <div className="flex items-center gap-2 font-bold text-slate-400">
          <Shield className="h-4 w-4 text-cyan-400" />
          <span>SafeAid AI &bull; Campus Health & Safety Companion</span>
        </div>
        <p className="max-w-xl text-[11px] text-slate-500">
          SafeAid AI is an educational first-aid assistant powered by Google Gemini API. It provides guidance and immediate precautions, not medical diagnoses. For life-threatening emergencies, immediately dial 112 or contact campus emergency services.
        </p>
        <p className="mt-1 text-[10px] text-slate-600">
          Built for Hackathon MVP &bull; Client: React + Vite + Tailwind CSS &bull; Server: Node.js + @google/genai
        </p>
      </div>
    </footer>
  );
}
