import React, { useState } from "react";
import { X, Save, Settings as SettingsIcon, RotateCcw } from "lucide-react";
import { DEFAULT_SETTINGS } from "../utils/storage";

export default function SettingsModal({ isOpen, onClose, settings, onSave }) {
  if (!isOpen) return null;

  const [form, setForm] = useState({ ...settings });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(form);
    onClose();
  };

  const handleReset = () => {
    setForm(DEFAULT_SETTINGS);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="settingsModalTitle"
    >
      <div className="relative w-full max-w-md overflow-hidden rounded-3xl border border-slate-700 bg-[#0e1626] p-6 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2.5 border-b border-slate-800 pb-3">
          <SettingsIcon className="h-5 w-5 text-cyan-400" />
          <h2 id="settingsModalTitle" className="text-lg font-bold text-white">
            Campus Emergency Settings
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-xs">
          {/* User Name */}
          <div>
            <label className="font-semibold text-slate-300">Your Name (Optional)</label>
            <input
              type="text"
              name="userName"
              value={form.userName}
              onChange={handleChange}
              placeholder="e.g. John Doe"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Emergency Contact Name */}
          <div>
            <label className="font-semibold text-slate-300">Emergency Contact Name</label>
            <input
              type="text"
              name="emergencyContactName"
              value={form.emergencyContactName}
              onChange={handleChange}
              placeholder="Parent / Guardian"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Emergency Contact Phone */}
          <div>
            <label className="font-semibold text-slate-300">Emergency Contact Phone</label>
            <input
              type="tel"
              name="emergencyContactPhone"
              value={form.emergencyContactPhone}
              onChange={handleChange}
              placeholder="+91 98765 43210"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Campus Security Phone */}
          <div>
            <label className="font-semibold text-slate-300">Campus Security Helpline</label>
            <input
              type="tel"
              name="campusSecurityPhone"
              value={form.campusSecurityPhone}
              onChange={handleChange}
              placeholder="+91 99887 76655"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Campus Medical Center Phone */}
          <div>
            <label className="font-semibold text-slate-300">Campus Medical Center</label>
            <input
              type="tel"
              name="campusMedicalPhone"
              value={form.campusMedicalPhone}
              onChange={handleChange}
              placeholder="+91 91234 56789"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* National Emergency Number */}
          <div>
            <label className="font-semibold text-slate-300">National Emergency Number</label>
            <input
              type="text"
              name="emergencyServicesNumber"
              value={form.emergencyServicesNumber}
              onChange={handleChange}
              placeholder="112 (or 911 / 999)"
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-100 placeholder-slate-600 focus:border-cyan-400 focus:outline-none"
            />
          </div>

          {/* Preferred Language */}
          <div>
            <label className="font-semibold text-slate-300">Preferred Language</label>
            <select
              name="preferredLanguage"
              value={form.preferredLanguage}
              onChange={handleChange}
              className="mt-1 w-full rounded-xl border border-slate-800 bg-slate-900 p-2.5 text-slate-100 focus:border-cyan-400 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="Hindi">हिन्दी (Hindi)</option>
              <option value="Tamil">தமிழ் (Tamil)</option>
              <option value="Telugu">తెలుగు (Telugu)</option>
              <option value="Bengali">বাংলা (Bengali)</option>
              <option value="Marathi">मराठी (Marathi)</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="mt-5 flex items-center justify-between pt-2">
            <button
              type="button"
              onClick={handleReset}
              className="flex items-center gap-1 text-slate-400 hover:text-slate-200"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset Defaults</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-2 font-semibold text-slate-400 hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 rounded-xl bg-cyan-500 px-4 py-2 font-bold text-slate-950 shadow-md hover:bg-cyan-400"
              >
                <Save className="h-4 w-4" />
                <span>Save Settings</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
