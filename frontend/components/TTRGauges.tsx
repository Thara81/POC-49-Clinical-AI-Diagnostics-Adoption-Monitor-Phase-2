"use client";

import { useEffect, useState } from "react";
import { TimeToReport, UseCase } from "@/lib/types";
import { getTimeToReport } from "@/lib/api";
import { CardEyebrow, CardTitle } from "@/components/ui/card";

const UC_COLOR: Record<UseCase, string> = {
  radiology: "#38BDF8",
  pathology: "#F59E0B",
  triage: "#818CF8",
};
const UC_LABEL: Record<UseCase, string> = {
  radiology: "Radiology",
  pathology: "Pathology",
  triage: "Triage",
};

function Gauge({ value, color, label }: { value: number; color: string; label: string }) {
  const r = 42;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - value / 100);
  return (
    <div className="flex flex-col items-center gap-1">
      <svg width={110} height={110} viewBox="0 0 110 110">
        <circle cx="55" cy="55" r={r} stroke="#1F2937" strokeWidth="9" fill="none" />
        <circle
          cx="55"
          cy="55"
          r={r}
          stroke={color}
          strokeWidth="9"
          fill="none"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 55 55)"
          style={{ transition: "stroke-dashoffset 0.6s ease" }}
        />
        <text x="55" y="52" textAnchor="middle" fontSize="20" fontWeight="600" fill="#E6EDF3" fontFamily="monospace">
          {value}%
        </text>
        <text x="55" y="68" textAnchor="middle" fontSize="8.5" fill="#7E97A0">
          faster
        </text>
      </svg>
      <div className="text-xs text-slate-300">{label}</div>
    </div>
  );
}

export default function TTRGauges() {
  const [data, setData] = useState<TimeToReport | null>(null);
  useEffect(() => {
    getTimeToReport().then(setData);
  }, []);

  if (!data) return <div className="rr-card p-5 h-[200px] animate-pulse" />;

  const useCases: UseCase[] = ["radiology", "pathology", "triage"];

  return (
    <div className="rr-card p-5">
      <CardEyebrow>Turnaround</CardEyebrow>
      <CardTitle>Time-to-report improvement</CardTitle>
      <div className="flex justify-around flex-wrap gap-3">
        {useCases.map((uc) => (
          <Gauge key={uc} value={data[uc].improvement_pct} color={UC_COLOR[uc]} label={UC_LABEL[uc]} />
        ))}
      </div>
      <div className="text-[11px] text-slate-500 mt-2">
        Network-wide average: {data._network_avg_improvement_pct}% faster report turnaround with AI assistance (mock).
      </div>
    </div>
  );
}
