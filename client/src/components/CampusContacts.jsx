import React from "react";
import { Phone, ShieldAlert, HeartPulse, LifeBuoy } from "lucide-react";

export default function CampusContacts({ settings, onOpenSettings }) {
  const {
    campusSecurityPhone = "+91 99887 76655",
    campusMedicalPhone = "+91 91234 56789",
    emergencyServicesNumber = "112"
  } = settings || {};

  const cleanNumber = (num) => num.replace(/[^0-9+]/g, "");

  return (
    <section className="mx-auto max-w-4xl px-4 py-4">
      <div className="rounded-2xl border border-slate-800 bg-[#0b1222]/80 p-4 sm:p-5">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
          <div className="flex items-center gap-2">
            <LifeBuoy className="h-5 w-5 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              Campus Emergency Contacts
            </h3>
          </div>
          <button
            type="button"
            onClick={onOpenSettings}
            className="text-xs text-cyan-400 hover:underline"
          >
            Edit Numbers
          </button>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Emergency Services */}
          <a
            href={`tel:${cleanNumber(emergencyServicesNumber)}`}
            className="flex items-center justify-between rounded-xl border border-red-500/20 bg-red-950/20 p-3 hover:border-red-500/50 hover:bg-red-950/40 transition-all"
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-red-400">Emergency</span>
              <p className="text-sm font-black text-white">{emergencyServicesNumber}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-600 text-white">
              <Phone className="h-4 w-4" />
            </div>
          </a>

          {/* Campus Security */}
          <a
            href={`tel:${cleanNumber(campusSecurityPhone)}`}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 hover:border-cyan-500/40 hover:bg-slate-800 transition-all"
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-cyan-400">Campus Security</span>
              <p className="text-xs font-bold text-white">{campusSecurityPhone}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-600 text-white">
              <ShieldAlert className="h-4 w-4" />
            </div>
          </a>

          {/* Campus Medical Center */}
          <a
            href={`tel:${cleanNumber(campusMedicalPhone)}`}
            className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900/80 p-3 hover:border-emerald-500/40 hover:bg-slate-800 transition-all"
          >
            <div>
              <span className="text-[10px] font-bold uppercase text-emerald-400">Medical Center</span>
              <p className="text-xs font-bold text-white">{campusMedicalPhone}</p>
            </div>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white">
              <HeartPulse className="h-4 w-4" />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
}
