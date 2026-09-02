import React, { useState } from "react";
import {
  AlertTriangle,
  AlertOctagon,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Share2,
  RefreshCw,
  PhoneCall,
  Info
} from "lucide-react";

export default function ResultCard({
  guidance,
  onOpenEmergency,
  onTranslate,
  isTranslating,
  currentLanguage,
  setCurrentLanguage
}) {
  if (!guidance) return null;

  const {
    situation,
    category,
    severity = "low",
    confidence,
    summary,
    immediate_actions = [],
    avoid = [],
    when_to_seek_help = [],
    emergency_required = false,
    emergency_reason = "",
    is_demo = false
  } = guidance;

  const getSeverityStyle = (level) => {
    switch (level?.toLowerCase()) {
      case "critical":
        return {
          bg: "bg-red-950/70 border-red-500 shadow-[0_0_25px_rgba(220,38,38,0.5)]",
          badgeBg: "bg-red-600 text-white animate-pulse",
          text: "CRITICAL",
          textColor: "text-red-400",
          icon: <AlertOctagon className="h-5 w-5 text-red-400 animate-bounce" />
        };
      case "high":
        return {
          bg: "bg-rose-950/50 border-rose-500/70 shadow-[0_0_20px_rgba(244,63,94,0.35)]",
          badgeBg: "bg-rose-600 text-white",
          text: "HIGH PRIORITY",
          textColor: "text-rose-400",
          icon: <AlertTriangle className="h-5 w-5 text-rose-400" />
        };
      case "medium":
        return {
          bg: "bg-amber-950/40 border-amber-500/60 shadow-[0_0_15px_rgba(245,158,11,0.2)]",
          badgeBg: "bg-amber-500 text-amber-950 font-bold",
          text: "MEDIUM RISK",
          textColor: "text-amber-400",
          icon: <AlertTriangle className="h-5 w-5 text-amber-400" />
        };
      default:
        return {
          bg: "bg-emerald-950/30 border-emerald-500/50",
          badgeBg: "bg-emerald-600 text-white",
          text: "LOW RISK",
          textColor: "text-emerald-400",
          icon: <CheckCircle className="h-5 w-5 text-emerald-400" />
        };
    }
  };

  const severityStyle = getSeverityStyle(severity);
  const isHighOrCritical = severity === "high" || severity === "critical" || emergency_required;

  const languages = [
    { code: "English", label: "English" },
    { code: "Hindi", label: "हिन्दी (Hindi)" },
    { code: "Tamil", label: "தமிழ் (Tamil)" },
    { code: "Telugu", label: "తెలుగు (Telugu)" },
    { code: "Bengali", label: "বাংলা (Bengali)" },
    { code: "Marathi", label: "मराठी (Marathi)" }
  ];

  return (
    <div className="mx-auto max-w-4xl px-4 py-4">
      {/* Demo Data Tag if in demo mode */}
      {is_demo && (
        <div className="mb-3 flex items-center justify-between rounded-lg border border-cyan-500/40 bg-cyan-950/50 px-3 py-2 text-xs text-cyan-300">
          <div className="flex items-center gap-2">
            <span className="rounded bg-cyan-500 px-1.5 py-0.5 text-[10px] font-bold text-cyan-950">
              DEMO DATA
            </span>
            <span>This is simulated guidance for hackathon testing & evaluation.</span>
          </div>
        </div>
      )}

      {/* Prominent Emergency Callout for High or Critical Priority */}
      {isHighOrCritical && (
        <div className="mb-4 overflow-hidden rounded-2xl border-2 border-red-500 bg-gradient-to-r from-red-950/90 via-red-900/80 to-red-950/90 p-4 text-white shadow-xl shadow-red-900/30 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="rounded-xl bg-red-600 p-2 text-white">
                <AlertOctagon className="h-6 w-6 animate-pulse" />
              </div>
              <div>
                <h3 className="text-base font-extrabold tracking-tight sm:text-lg">
                  Emergency Situation Detected
                </h3>
                <p className="text-xs text-red-200 sm:text-sm">
                  {emergency_reason || "Immediate professional assistance or campus emergency intervention is advised."}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onOpenEmergency}
              className="flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-extrabold text-red-600 shadow-lg transition-transform hover:scale-105 active:scale-95 sm:self-center"
            >
              <PhoneCall className="h-4 w-4" />
              <span>Open Emergency Help</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Guidance Container */}
      <div className={`overflow-hidden rounded-2xl border ${severityStyle.bg} p-5 backdrop-blur-xl sm:p-7 space-y-6`}>
        {/* Top Header: Badge, Category, Confidence, Translation */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Severity Pill */}
            <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-black tracking-wide ${severityStyle.badgeBg}`}>
              {severityStyle.icon}
              <span>{severityStyle.text}</span>
            </span>

            {/* Category */}
            <span className="rounded-full border border-slate-700 bg-slate-800/80 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-slate-300">
              {category}
            </span>

            {/* Confidence */}
            {confidence && (
              <span className="text-xs text-slate-400">
                Confidence: {(confidence * 100).toFixed(0)}%
              </span>
            )}
          </div>

          {/* Translation Dropdown */}
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-cyan-400" />
            <select
              value={currentLanguage}
              disabled={isTranslating}
              onChange={(e) => {
                const lang = e.target.value;
                setCurrentLanguage(lang);
                if (lang !== "English") {
                  onTranslate(lang);
                }
              }}
              className="rounded-lg border border-slate-700 bg-slate-900 px-2.5 py-1 text-xs font-semibold text-slate-200 focus:border-cyan-400 focus:outline-none"
            >
              {languages.map((l) => (
                <option key={l.code} value={l.code}>
                  {l.label}
                </option>
              ))}
            </select>
            {isTranslating && <RefreshCw className="h-3.5 w-3.5 animate-spin text-cyan-400" />}
          </div>
        </div>

        {/* Situation Title & Summary */}
        <div>
          <h2 className="text-xl font-black text-white sm:text-2xl">{situation}</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">{summary}</p>
        </div>

        {/* Immediate Actions (Numbered) */}
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-4 sm:p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-emerald-400" />
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-emerald-300">
              Immediate Safety & First-Aid Actions
            </h3>
          </div>

          <div className="space-y-2.5">
            {immediate_actions.map((action, idx) => (
              <div
                key={action.slice(0, 40)}
                className="flex items-start gap-3 rounded-lg border border-emerald-500/20 bg-[#09151c]/80 p-3 text-sm text-slate-100"
              >
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500 text-xs font-bold text-emerald-950">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{action.replace(/^\d+[\.\)]\s*/, "")}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Two Column Grid: Avoid vs When to Seek Help */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* Things to Avoid (Red Styling) */}
          <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-400" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-red-300">
                Critical Precautions: What to Avoid
              </h4>
            </div>
            <ul className="space-y-2">
              {avoid.map((item) => (
                <li
                  key={item.slice(0, 40)}
                  className="rounded-lg border border-red-500/20 bg-red-950/30 p-2.5 text-xs text-red-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* When to Seek Help (Amber Styling) */}
          <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4">
            <div className="mb-2.5 flex items-center gap-2">
              <Clock className="h-4 w-4 text-amber-400" />
              <h4 className="text-xs font-extrabold uppercase tracking-wider text-amber-300">
                When to Seek Medical Attention
              </h4>
            </div>
            <ul className="space-y-2">
              {when_to_seek_help.map((item) => (
                <li
                  key={item.slice(0, 40)}
                  className="rounded-lg border border-amber-500/20 bg-amber-950/30 p-2.5 text-xs text-amber-200"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Clinical Disclaimer Box */}
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3.5 text-xs text-slate-400">
          <div className="flex items-center gap-1.5 font-bold text-slate-300 mb-1">
            <Info className="h-3.5 w-3.5 text-cyan-400" />
            <span>Important Safety Notice</span>
          </div>
          <p>
            SafeAid AI is an educational assistance companion. It does not replace clinical diagnosis by licensed doctors, campus nurses, or emergency paramedics. If in doubt, contact Campus Medical Center or local emergency services (112).
          </p>
        </div>
      </div>
    </div>
  );
}
