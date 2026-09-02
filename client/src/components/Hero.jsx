import React from "react";
import { Sparkles, FileText, Cpu, CheckCircle2, PhoneCall } from "lucide-react";

export default function Hero({ onOpenDemo }) {
  return (
    <section className="relative overflow-hidden pt-8 pb-4 text-center">
      {/* Decorative Glow */}
      <div className="pointer-events-none absolute -top-24 left-1/2 -z-10 h-72 w-96 -translate-x-1/2 rounded-full bg-cyan-500/10 blur-3xl" />

      <div className="mx-auto max-w-4xl px-4">
        {/* Top pill */}
        <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/40 px-3.5 py-1 text-xs font-semibold text-cyan-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400" />
          <span>Multimodal Campus First-Aid & Hazard Response</span>
        </div>

        {/* Hero headline */}
        <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white sm:text-5xl sm:leading-tight">
          Get clear guidance when{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500 bg-clip-text text-transparent">
            every second matters.
          </span>
        </h1>

        <p className="mx-auto mt-3 max-w-2xl text-base text-slate-300 sm:text-lg">
          Your campus health & safety companion. Instant, step-by-step first-aid advice for minor medical incidents, lab accidents, and physical campus hazards.
        </p>

        {/* How It Works Grid */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 mb-1.5">
              <FileText className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white">1. Describe / Upload</span>
            <span className="text-[11px] text-slate-400">Type situation or take photo</span>
          </div>

          <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/10 text-blue-400 mb-1.5">
              <Cpu className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white">2. AI Analyzes</span>
            <span className="text-[11px] text-slate-400">Gemini evaluates severity</span>
          </div>

          <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 mb-1.5">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white">3. Follow Safe Steps</span>
            <span className="text-[11px] text-slate-400">Clear actions & what to avoid</span>
          </div>

          <div className="flex flex-col items-center rounded-xl border border-slate-800 bg-slate-900/60 p-3 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-red-500/10 text-red-400 mb-1.5">
              <PhoneCall className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold text-white">4. Contact Help</span>
            <span className="text-[11px] text-slate-400">112 or Campus Security</span>
          </div>
        </div>
      </div>
    </section>
  );
}
