"use client";

import { X } from "lucide-react";
import { CardEyebrow, CardTitle } from "@/components/ui/card";
import Sidebar from "@/components/Sidebar";
import AdoptionTrendChart from "@/components/AdoptionTrendChart";
import ConcordanceChart from "@/components/ConcordanceChart";
import TTRGauges from "@/components/TTRGauges";
import CoverageMatrix from "@/components/CoverageMatrix";
import FdaRegistryPanel from "@/components/FdaRegistryPanel";
import { FacilityProperties, UseCase } from "@/lib/types";

export type PanelTab = "facility" | "insights" | "analytics";

const UC_COLOR: Record<UseCase, string> = {
  radiology: "#38BDF8",
  pathology: "#F59E0B",
  triage: "#818CF8",
};

export default function IntelligencePanel({
  open,
  onClose,
  tab,
  onChangeTab,
  facility,
  activeUseCase,
  onChangeUseCase,
}: {
  open: boolean;
  onClose: () => void;
  tab: PanelTab;
  onChangeTab: (t: PanelTab) => void;
  facility: FacilityProperties | null;
  activeUseCase: UseCase | "all";
  onChangeUseCase: (uc: UseCase | "all") => void;
}) {
  const tabs: { id: PanelTab; label: string }[] = [
    ...(facility ? [{ id: "facility" as PanelTab, label: "Facility" }] : []),
    { id: "insights", label: "Insights" },
    { id: "analytics", label: "Analytics" },
  ];

  return (
    <>
      {/* Backdrop — click to close, per "Click & Move" exit logic */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity duration-300 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Slide-over panel — hidden by default, slides in from the right */}
      <aside
        className={`fixed top-0 right-0 z-50 h-full w-full sm:w-[440px] bg-[#0D242B]/95 backdrop-blur-xl border-l border-slateBorder
          transform transition-transform duration-300 ease-out flex flex-col
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Panel header: tabs + close */}
        <div className="flex items-center justify-between px-4 pt-5 pb-3 border-b border-slateBorder shrink-0">
          <div className="flex gap-1.5">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => onChangeTab(t.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium border transition-all ${
                  tab === t.id
                    ? "border-brandTeal text-brandTeal rr-glow"
                    : "border-slateBorder text-slate-400 hover:text-white"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full text-slate-400 hover:text-white hover:bg-white/5 transition-all"
            aria-label="Close intelligence panel"
          >
            <X size={16} />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-4">
          {tab === "facility" && facility && (
            <div className="rr-card p-5">
              <CardEyebrow>Selected data point</CardEyebrow>
              <CardTitle>{facility.name}</CardTitle>
              <p className="text-[13px] text-slate-400 mb-4">
                {facility.city}, {facility.country}
              </p>
              <div className="space-y-2 mb-4">
                {(["radiology", "pathology", "triage"] as UseCase[]).map((uc) => (
                  <div
                    key={uc}
                    className="flex justify-between items-center py-2 px-3 rounded-md border border-slateBorder"
                  >
                    <span className="text-[12.5px] capitalize" style={{ color: UC_COLOR[uc] }}>
                      {uc}
                    </span>
                    <span className="font-mono text-[12px] text-slate-200">
                      {facility.deployments[uc] ?? "— not deployed"}
                    </span>
                  </div>
                ))}
              </div>
              <div className="rr-mono">
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">
                  Use-case coverage
                </div>
                <div className="text-2xl font-semibold text-brandTeal mt-1">
                  {facility.coverage_pct_of_use_cases}%
                </div>
                <div className="text-[11px] text-slate-500">of radiology / pathology / triage live here</div>
              </div>
            </div>
          )}

          {tab === "insights" && (
            <Sidebar activeUseCase={activeUseCase} onChangeUseCase={onChangeUseCase} />
          )}

          {tab === "analytics" && (
            <>
              <AdoptionTrendChart />
              <ConcordanceChart />
              <TTRGauges />
              <CoverageMatrix />
              <FdaRegistryPanel />
            </>
          )}
        </div>
      </aside>
    </>
  );
}