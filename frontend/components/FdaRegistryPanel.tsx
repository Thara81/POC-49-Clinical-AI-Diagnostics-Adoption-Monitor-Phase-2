"use client";

import { useEffect, useState } from "react";
import { ExternalLink } from "lucide-react";
import { FdaRegistry, UseCase } from "@/lib/types";
import { getFdaRegistry } from "@/lib/api";
import { CardEyebrow, CardTitle } from "@/components/ui/card";

const UC_COLOR: Record<UseCase, string> = {
  radiology: "#38BDF8",
  pathology: "#F59E0B",
  triage: "#818CF8",
};

export default function FdaRegistryPanel() {
  const [data, setData] = useState<FdaRegistry | null>(null);

  useEffect(() => {
    getFdaRegistry().then(setData);
  }, []);

  if (!data) return <div className="rr-card p-5 h-[220px] animate-pulse" />;

  return (
    <div className="rr-card p-5">
      <div className="flex items-center justify-between mb-1">
        <CardEyebrow>Regulatory registry — real data</CardEyebrow>
        <span className="inline-block text-[9.5px] font-mono uppercase tracking-[0.12em] text-emerald-400 border border-emerald-400/40 rounded-full px-2 py-0.5">
          sourced, not mock
        </span>
      </div>
      <CardTitle>FDA-cleared AI/ML diagnostic devices</CardTitle>
      <div className="overflow-x-auto max-h-[260px]">
        <table className="w-full text-[12px]">
          <thead>
            <tr>
              <th className="text-left py-1.5 px-2 text-slate-400 font-medium border-b border-slateBorder">Manufacturer</th>
              <th className="text-left py-1.5 px-2 text-slate-400 font-medium border-b border-slateBorder">Product line</th>
              <th className="text-left py-1.5 px-2 text-slate-400 font-medium border-b border-slateBorder">Specialty</th>
            </tr>
          </thead>
          <tbody>
            {data.devices.map((d, i) => (
              <tr key={i} className={i % 2 ? "bg-white/[0.02]" : ""}>
                <td className="py-1.5 px-2 border-b border-slateBorder text-slate-200">{d.manufacturer}</td>
                <td className="py-1.5 px-2 border-b border-slateBorder text-slate-300">{d.product_line}</td>
                <td className="py-1.5 px-2 border-b border-slateBorder">
                  <span className="font-mono text-[11px] capitalize" style={{ color: UC_COLOR[d.specialty] }}>
                    {d.specialty}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="text-[11px] text-slate-500 mt-3 flex items-start gap-1.5">
        
        <a  href={data.source.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-cyan hover:underline shrink-0"
        >
          {data.source.publisher} <ExternalLink size={11} />
        </a>
        <span>— {data.source.snapshot_note}</span>
      </div>
    </div>
  );
}