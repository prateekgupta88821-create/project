import React from "react";
import { X, Sparkles, ChevronRight } from "lucide-react";
import { DEMO_SCENARIOS } from "../utils/demoData";

export default function DemoModal({ isOpen, onClose, onSelectScenario }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="demoModalTitle"
    >
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-cyan-500/40 bg-[#0c1324] p-6 shadow-2xl shadow-cyan-950/50 animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 id="demoModalTitle" className="text-lg font-bold text-white">
              Judge & Evaluator Demo Scenarios
            </h2>
            <p className="text-xs text-cyan-300">
              Instant multimodal guidance without requiring an API key
            </p>
          </div>
        </div>

        <div className="mt-4 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1">
          {DEMO_SCENARIOS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => {
                onSelectScenario(item);
                onClose();
              }}
              className="group flex w-full items-start justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-3.5 text-left transition-all hover:border-cyan-500/50 hover:bg-slate-800/80"
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{item.icon}</span>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white group-hover:text-cyan-300">
                      {item.title}
                    </span>
                    <span className="rounded-full border border-slate-700 bg-slate-800 px-2 py-0.5 text-[10px] font-semibold uppercase text-slate-300">
                      {item.guidance.severity} severity
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs text-slate-400">{item.prompt}</p>
                </div>
              </div>
              <ChevronRight className="h-5 w-5 shrink-0 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
            </button>
          ))}
        </div>

        <div className="mt-4 border-t border-slate-800 pt-3 text-center">
          <span className="text-[11px] text-slate-400">
            Select any scenario above to test the triage badge, action steps, precautions, and translation.
          </span>
        </div>
      </div>
    </div>
  );
}
