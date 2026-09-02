import React from "react";
import { Phone, MessageSquare, AlertOctagon, X, ShieldAlert, HeartPulse, ExternalLink } from "lucide-react";

export default function EmergencyModal({ isOpen, onClose, settings, situationText }) {
  if (!isOpen) return null;

  const {
    emergencyContactName = "Emergency Contact",
    emergencyContactPhone = "+91 98765 43210",
    campusSecurityPhone = "+91 99887 76655",
    campusMedicalPhone = "+91 91234 56789",
    emergencyServicesNumber = "112"
  } = settings || {};

  const cleanNumber = (num) => num.replace(/[^0-9+]/g, "");

  const smsMessage = encodeURIComponent(
    `[SafeAid Campus Emergency Alert] Need assistance. Location/Situation: ${situationText || "Campus incident reported"}. Please contact me immediately.`
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="emergencyModalTitle"
    >
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl border-2 border-red-500 bg-[#0c1220] p-6 shadow-2xl shadow-red-950/60 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 rounded-xl border border-slate-800 bg-slate-900/80 p-2 text-slate-400 hover:bg-slate-800 hover:text-white"
          aria-label="Close modal"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-600 text-white shadow-lg shadow-red-600/40 animate-pulse">
            <AlertOctagon className="h-7 w-7" />
          </div>
          <div>
            <h2 id="emergencyModalTitle" className="text-xl font-black text-white">
              Emergency Assistance
            </h2>
            <p className="text-xs text-red-300">
              Contacting emergency services & campus first-responders
            </p>
          </div>
        </div>

        {/* Notification Warning */}
        <div className="mt-4 rounded-xl border border-red-500/30 bg-red-950/30 p-3 text-xs text-red-200">
          <p className="font-semibold">Important:</p>
          <p className="mt-0.5 text-slate-300">
            Tapping the buttons below launches your device's native phone dialer or messaging app directly.
          </p>
        </div>

        {/* Primary National Emergency Call */}
        <div className="mt-5">
          <a
            href={`tel:${cleanNumber(emergencyServicesNumber)}`}
            className="flex items-center justify-between rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 p-4 text-white shadow-xl shadow-red-600/30 transition-transform hover:scale-[1.02] active:scale-95"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
                <Phone className="h-6 w-6 text-white animate-bounce" />
              </div>
              <div>
                <span className="block text-xs font-semibold uppercase tracking-wider text-red-200">
                  National Emergency Hotline
                </span>
                <span className="text-2xl font-black tracking-tight">{emergencyServicesNumber}</span>
              </div>
            </div>
            <span className="rounded-xl bg-white px-3 py-1.5 text-xs font-black text-red-700">
              CALL NOW
            </span>
          </a>
        </div>

        {/* Campus Responder Action Grid */}
        <div className="mt-4 space-y-2.5">
          {/* Campus Security */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-3">
            <div className="flex items-center gap-2.5">
              <ShieldAlert className="h-5 w-5 text-cyan-400" />
              <div>
                <p className="text-xs font-bold text-white">Campus Security</p>
                <p className="text-[11px] text-slate-400">{campusSecurityPhone}</p>
              </div>
            </div>
            <a
              href={`tel:${cleanNumber(campusSecurityPhone)}`}
              className="flex items-center gap-1 rounded-lg bg-cyan-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-cyan-500"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Security</span>
            </a>
          </div>

          {/* Campus Medical Center */}
          <div className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/90 p-3">
            <div className="flex items-center gap-2.5">
              <HeartPulse className="h-5 w-5 text-emerald-400" />
              <div>
                <p className="text-xs font-bold text-white">Campus Medical Center</p>
                <p className="text-[11px] text-slate-400">{campusMedicalPhone}</p>
              </div>
            </div>
            <a
              href={`tel:${cleanNumber(campusMedicalPhone)}`}
              className="flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500"
            >
              <Phone className="h-3.5 w-3.5" />
              <span>Call Clinic</span>
            </a>
          </div>

          {/* Personal Emergency Contact (Call & SMS) */}
          <div className="flex flex-col gap-2 rounded-xl border border-slate-800 bg-slate-900/90 p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-white">{emergencyContactName}</p>
              <p className="text-[11px] text-slate-400">{emergencyContactPhone}</p>
            </div>
            <div className="flex gap-2">
              <a
                href={`tel:${cleanNumber(emergencyContactPhone)}`}
                className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 hover:bg-slate-700"
              >
                <Phone className="h-3.5 w-3.5 text-slate-300" />
                <span>Call</span>
              </a>
              <a
                href={`sms:${cleanNumber(emergencyContactPhone)}?body=${smsMessage}`}
                className="flex items-center gap-1 rounded-lg bg-purple-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-purple-500"
              >
                <MessageSquare className="h-3.5 w-3.5" />
                <span>SMS Alert</span>
              </a>
            </div>
          </div>
        </div>

        {/* Dismiss Footer */}
        <div className="mt-5 border-t border-slate-800 pt-3 text-center">
          <button
            type="button"
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-slate-200"
          >
            Dismiss / Return to SafeAid AI
          </button>
        </div>
      </div>
    </div>
  );
}
