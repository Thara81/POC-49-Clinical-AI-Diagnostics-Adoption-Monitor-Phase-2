"use client";

import { useState } from "react";
import { Info, X, PanelRightOpen } from "lucide-react";

export default function Header({ onOpenPanel }: { onOpenPanel: () => void }) {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-16 flex items-center justify-between px-4 sm:px-6 bg-gradient-to-b from-[#071A20]/85 via-[#071A20]/50 to-transparent backdrop-blur-md">
        <div className="min-w-0">
          <div className="font-mono text-[9.5px] tracking-[0.16em] text-brandTeal uppercase leading-none mb-1">
            Infocreon Internship
          </div>
          <div className="text-[13px] sm:text-[15px] font-semibold text-white leading-tight truncate max-w-[62vw] sm:max-w-none">
            Clinical AI Diagnostics Adoption Monitoring Dashboard
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={onOpenPanel}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-slateBorder text-slate-300 text-xs font-medium hover:text-white hover:border-brandTeal/60 transition-all bg-[#0D242B]/60"
            aria-label="Open intelligence panel"
          >
            <PanelRightOpen size={14} />
            <span className="hidden sm:inline">Intelligence</span>
          </button>
          <button
            onClick={() => setShowInfo((v) => !v)}
            className="w-8 h-8 flex items-center justify-center rounded-full border border-slateBorder text-slate-300 hover:text-brandTeal hover:border-brandTeal/60 transition-all bg-[#0D242B]/60"
            aria-label="Project information"
          >
            <Info size={15} />
          </button>
        </div>
      </header>

      {showInfo && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowInfo(false)} />
          <div className="fixed top-[68px] right-4 sm:right-6 z-50 w-[280px] rr-card p-4 rr-glow">
            <div className="flex items-center justify-between mb-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-brandTeal">
                Developer Signature
              </span>
              <button onClick={() => setShowInfo(false)} className="text-slate-500 hover:text-white">
                <X size={14} />
              </button>
            </div>
            <dl className="space-y-2 text-[12.5px]">
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Architect</dt>
                <dd className="text-white font-medium text-right">Thara Asharaf</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">POC ID</dt>
                <dd className="text-white font-mono text-right">49</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">GitHub</dt>
                <dd className="text-white font-mono text-right">Thara81</dd>
              </div>
              <div className="flex justify-between gap-3">
                <dt className="text-slate-500">Batch</dt>
                <dd className="text-white text-right">Batch 6 Interns</dd>
              </div>
              <div className="pt-1 border-t border-slateBorder">
                <dt className="text-slate-500 mb-1">Stack</dt>
                <dd className="text-slate-200 text-[12px] leading-snug">
                  Next.js, FastAPI, Tailwind CSS, Leaflet + Recharts
                </dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </>
  );
}