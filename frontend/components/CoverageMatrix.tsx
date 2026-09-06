"use client";

import { useEffect, useState } from "react";
import { CoverageRow, UseCase } from "@/lib/types";
import { getCoverageMatrix } from "@/lib/api";
import { CardEyebrow, CardTitle } from "@/components/ui/card";

const UC_COLOR: Record<UseCase, string> = {
  radiology: "#38BDF8",
  pathology: "#F59E0B",
  triage: "#818CF8",
};

export default function CoverageMatrix() {
  const [rows, setRows] = useState<CoverageRow[]>([]);
  useEffect(() => {
    getCoverageMatrix().then(setRows);
  }, []);

  const useCases: UseCase[] = ["radiology", "pathology", "triage"];

  return (
    <div className="rr-card p-5">
      <CardEyebrow>Rollout status</CardEyebrow>
      <CardTitle>Use-case coverage matrix</CardTitle>
      <div className="overflow-x-auto">
        <table className="w-full text-[12.5px]">
          <thead>
            <tr>
              <th className="text-left py-1.5 px-2 text-slate-400 font-medium border-b border-slateBorder">Facility</th>
              {useCases.map((uc) => (
                <th key={uc} className="text-center py-1.5 px-2 font-semibold border-b border-slateBorder capitalize" style={{ color: UC_COLOR[uc] }}>
                  {uc}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.id} className={i % 2 ? "bg-white/[0.02]" : ""}>
                <td className="py-1.5 px-2 border-b border-slateBorder text-slate-200">
                  {r.name} <span className="text-slate-500 text-[11px]">· {r.country}</span>
                </td>
                {useCases.map((uc) => (
                  <td key={uc} className="text-center py-1.5 px-2 border-b border-slateBorder">
                    {r.coverage[uc] ? (
                      <span className="font-mono text-[11px]" style={{ color: UC_COLOR[uc] }}>● live</span>
                    ) : (
                      <span className="text-slateBorder">—</span>
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
