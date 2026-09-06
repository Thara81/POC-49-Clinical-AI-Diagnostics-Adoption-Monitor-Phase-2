"use client";

import { useEffect, useState } from "react";
import { Download } from "lucide-react";
import { Card, CardEyebrow, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { UseCase, ConcordanceRow } from "@/lib/types";
import { getConcordance, sampleDataDownloadUrl } from "@/lib/api";

const USE_CASES: (UseCase | "all")[] = ["all", "radiology", "pathology", "triage"];

export default function Sidebar({
  activeUseCase,
  onChangeUseCase,
}: {
  activeUseCase: UseCase | "all";
  onChangeUseCase: (uc: UseCase | "all") => void;
}) {
  const [avgConcordance, setAvgConcordance] = useState<number | null>(null);

  useEffect(() => {
    getConcordance().then((rows: ConcordanceRow[]) => {
      setAvgConcordance(rows.reduce((s, r) => s + r.ai, 0) / rows.length);
    });
  }, []);

  return (
    <aside className="w-full flex flex-col gap-4">
      {/* Section A — Title & headline metric */}
      <Card>
        <div className="inline-block font-mono text-[10.5px] tracking-[0.14em] text-cyan border border-cyan/50 rounded-full px-2.5 py-0.5 mb-3 uppercase rr-glow">
          Rail · Clinical AI
        </div>
        <h1 className="text-xl font-semibold tracking-tightest leading-snug mb-2">
          Clinical AI Diagnostics Adoption Monitor
        </h1>
        <p className="text-[13px] text-slate-400 mb-4">
          Deployment, concordance and reporting-speed telemetry for AI-assisted radiology,
          pathology and triage across Gulf health systems.
        </p>
        <div className="rr-mono">
          <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-slate-500">Network avg. AI concordance</div>
          <div className="text-3xl font-semibold text-cyan mt-1">
            {avgConcordance ? `${avgConcordance.toFixed(1)}%` : "—"}
          </div>
          <div className="text-[11px] text-slate-500">vs. specialist read, network-wide</div>
        </div>
      </Card>

      {/* Section B — Why this matters */}
      <Card className="border-l-2" style={{ borderLeftColor: "#38BDF8" }}>
        <CardEyebrow>Context</CardEyebrow>
        <CardTitle>Why this matters</CardTitle>
        <p className="text-[13px] leading-relaxed text-slate-300">
          AI-assisted diagnostics are moving from pilot to standard-of-care fastest in Gulf
          health systems investing heavily in digital-transformation mandates. Radiology leads
          adoption because imaging tools have the clearest regulatory pathway and the deepest
          concordance evidence base. Pathology and triage are growing faster but from a smaller
          base, with concordance still 3–5 points behind — faster reporting only matters if
          accuracy holds under real-world load.
        </p>
      </Card>

      {/* Section C — Who controls the rail */}
      <Card className="border-l-2" style={{ borderLeftColor: "#F59E0B" }}>
        <CardEyebrow>Governance</CardEyebrow>
        <CardTitle>Who controls the rail</CardTitle>
        <p className="text-[13px] leading-relaxed text-slate-300">
          No single body governs this rail. The WHO sets non-binding AI-for-health ethics
          guidance; the FDA and EU CE-mark (MDR) regime gate market entry for the underlying
          software-as-a-medical-device; and Gulf national health authorities (UAE DoH/MOHAP,
          Saudi SFDA, Qatar MOPH) layer their own procurement and localization rules on top.
          Hospital clinical-governance committees make the final go-live call per use case —
          adoption pace is set by how these approval layers stack, not by the technology alone.
        </p>
      </Card>

      {/* Section D — Functional filters */}
      <Card>
        <CardEyebrow>Filters</CardEyebrow>
        <CardTitle>Use case</CardTitle>
        <div className="flex flex-wrap gap-2">
          {USE_CASES.map((uc) => (
            <Button
              key={uc}
              variant="outline"
              active={activeUseCase === uc}
              onClick={() => onChangeUseCase(uc)}
              className="capitalize"
            >
              {uc}
            </Button>
          ))}
        </div>
        <p className="text-[11px] text-slate-500 mt-3">
          Filters the deployment map to facilities with a live tool for the selected use case.
        </p>
      </Card>

      {/* Section E — Download sample data */}
      <Card>
        <CardEyebrow>Export</CardEyebrow>
        <CardTitle>Sample data</CardTitle>
        <a href={sampleDataDownloadUrl()} download>
          <Button variant="primary" className="w-full flex items-center justify-center gap-2 py-2">
            <Download size={14} /> Download sample data (.json)
          </Button>
        </a>
        <p className="text-[11px] text-slate-500 mt-2">
          Full mock dataset: facilities, deployments, adoption trend, concordance, time-to-report.
        </p>
      </Card>
    </aside>
  );
}
