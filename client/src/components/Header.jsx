import React from "react";
import { Shield, AlertCircle, Settings, Activity } from "lucide-react";

export default function Header({ onOpenEmergency, onOpenSettings, isConfigured }) {
  return (
    <header className="sticky top-0 z-30 w-full border-b border-safeaid-border bg-[#080d1a]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25">
            <Shield className="h-6 w-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-extrabold tracking-tight text-white">SafeAid AI</span>
              <span className="hidden rounded-full border border-cyan-500/30 bg-cyan-500/10 px-2 py-0.5 text-[10px] font-semibold text-cyan-400 sm:inline-block">
                Campus Edition
              </span>
            </div>
            <p className="text-xs text-slate-400">Health & Safety Companion</p>
          </div>
        </div>

        {/* Right Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Status Indicator */}
          <div
            className="hidden items-center gap-1.5 rounded-full border border-slate-800 bg-slate-900/80 px-3 py-1 text-xs font-medium text-slate-300 md:flex"
            title={isConfigured ? "Google Gemini API connected" : "Demo Mode fallback active"}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                isConfigured ? "bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" : "bg-amber-400"
              }`}
            />
            <span>{isConfigured ? "Gemini Live" : "Demo Mode"}</span>
          </div>

          {/* Emergency Button */}
          <button
            type="button"
            onClick={onOpenEmergency}
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-red-600/30 transition-all hover:brightness-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-400"
            aria-label="Open emergency assistance panel"
          >
            <AlertCircle className="h-4 w-4 animate-bounce" />
            <span>Emergency Help</span>
          </button>

          {/* Settings Button */}
          <button
            type="button"
            onClick={onOpenSettings}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-400 transition-colors hover:border-slate-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-cyan-400"
            title="Configure campus and emergency contacts"
            aria-label="Settings"
          >
            <Settings className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
