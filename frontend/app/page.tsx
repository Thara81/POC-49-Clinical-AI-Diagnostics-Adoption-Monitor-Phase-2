"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Header from "@/components/Header";
import IntelligencePanel, { PanelTab } from "@/components/IntelligencePanel";
import { FacilityProperties, UseCase } from "@/lib/types";

// Leaflet touches `window` — must be client-only, no SSR.
const MapPanel = dynamic(() => import("@/components/MapPanel"), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-obsidian animate-pulse" />,
});

export default function Home() {
  const [activeUseCase, setActiveUseCase] = useState<UseCase | "all">("all");
  const [panelOpen, setPanelOpen] = useState(false);
  const [panelTab, setPanelTab] = useState<PanelTab>("insights");
  const [selectedFacility, setSelectedFacility] = useState<FacilityProperties | null>(null);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-obsidian">
      {/* Pillar II — Full-screen visualization stage */}
      <MapPanel
        activeUseCase={activeUseCase}
        onSelectFacility={(facility) => {
          setSelectedFacility(facility);
          setPanelTab("facility");
          setPanelOpen(true);
        }}
      />

      {/* Pillar III — Minimalist header with Developer Signature */}
      <Header
        onOpenPanel={() => {
          setPanelTab((t) => (t === "facility" && selectedFacility ? t : "insights"));
          setPanelOpen(true);
        }}
      />

      {/* Pillar II — Dynamic slide-over Intelligence Panel, hidden by default */}
      <IntelligencePanel
        open={panelOpen}
        onClose={() => setPanelOpen(false)}
        tab={panelTab}
        onChangeTab={setPanelTab}
        facility={selectedFacility}
        activeUseCase={activeUseCase}
        onChangeUseCase={setActiveUseCase}
      />
    </main>
  );
}