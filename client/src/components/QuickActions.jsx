import React from "react";

const QUICK_ACTIONS = [
  {
    id: "injury",
    label: "Injury",
    icon: "🩹",
    color: "from-amber-500/20 to-orange-500/10 hover:border-amber-500/50",
    prompt: "Someone slipped on the hallway stairs and has a swollen, painful wrist and scraped knee. What immediate first-aid steps should I take?"
  },
  {
    id: "fire",
    label: "Fire",
    icon: "🔥",
    color: "from-red-500/20 to-rose-500/10 hover:border-red-500/50",
    prompt: "There is smoke/fire near me in the science building. What immediate safety actions should I follow?"
  },
  {
    id: "breathing",
    label: "Breathing",
    icon: "🫁",
    color: "from-sky-500/20 to-blue-500/10 hover:border-sky-500/50",
    prompt: "A student is having sudden trouble breathing or choking in the dining hall. What immediate first-aid steps should I perform?"
  },
  {
    id: "bleeding",
    label: "Bleeding",
    icon: "🩸",
    color: "from-rose-500/20 to-pink-500/10 hover:border-rose-500/50",
    prompt: "Someone has a bleeding cut on their arm from broken lab glass. What immediate first-aid steps should I follow to stop the bleeding?"
  },
  {
    id: "electrical",
    label: "Electrical",
    icon: "⚡",
    color: "from-yellow-500/20 to-amber-500/10 hover:border-yellow-500/50",
    prompt: "There is a sparking exposed wire near water in the workshop. What safety steps should we take to prevent electrocution?"
  },
  {
    id: "chemical",
    label: "Chemical",
    icon: "🧪",
    color: "from-emerald-500/20 to-teal-500/10 hover:border-emerald-500/50",
    prompt: "Someone spilled an unknown chemical on their hands and clothes in the chemistry lab. What immediate first-aid flush steps should we take?"
  }
];

export default function QuickActions({ onSelectPrompt }) {
  return (
    <div className="mx-auto max-w-4xl px-4 py-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Quick Incident Prompts
        </span>
        <span className="text-[11px] text-slate-500">Tap to pre-fill situation</span>
      </div>

      <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-6">
        {QUICK_ACTIONS.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectPrompt(item.prompt)}
            className={`group flex flex-col items-center justify-center rounded-xl border border-slate-800 bg-gradient-to-b ${item.color} p-2.5 text-center transition-all hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-cyan-400`}
            title={item.prompt}
          >
            <span className="text-2xl transition-transform group-hover:scale-110">{item.icon}</span>
            <span className="mt-1 text-xs font-semibold text-slate-200 group-hover:text-white">
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
