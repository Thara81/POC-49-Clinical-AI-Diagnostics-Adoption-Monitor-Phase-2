"use client";

import { useEffect, useState } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell,
} from "recharts";
import { ConcordanceRow } from "@/lib/types";
import { getConcordance } from "@/lib/api";
import { CardEyebrow, CardTitle } from "@/components/ui/card";

const UC_COLOR: Record<string, string> = {
  radiology: "#38BDF8",
  pathology: "#F59E0B",
  triage: "#818CF8",
};

export default function ConcordanceChart() {
  const [data, setData] = useState<ConcordanceRow[]>([]);
  useEffect(() => {
    getConcordance().then(setData);
  }, []);

  return (
    <div className="rr-card p-5">
      <CardEyebrow>Clinical safety benchmark</CardEyebrow>
      <CardTitle>Diagnostic concordance vs specialist read</CardTitle>
      <ResponsiveContainer width="100%" height={240}>
        <BarChart data={data} margin={{ top: 4, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="use_case" tick={{ fill: "#7E97A0", fontSize: 11 }} axisLine={{ stroke: "#1F2937" }} tickLine={false} tickFormatter={(v) => v[0].toUpperCase() + v.slice(1)} />
          <YAxis domain={[80, 100]} tick={{ fill: "#7E97A0", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={{ background: "#030712", border: "1px solid #1F2937", borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: "#E6EDF3" }}
            formatter={(value: any, name: string, props: any) => {
              if (name === "ai") return [`${value}%`, "AI read"];
              if (name === "human") return [`${value}%`, "Specialist read"];
              return [value, name];
            }}
          />
          <Legend formatter={(v) => <span className="text-slate-400 text-xs">{v === "ai" ? "AI read" : "Specialist read"}</span>} />
          <Bar dataKey="ai" radius={[4, 4, 0, 0]}>
            {data.map((d, i) => (
              <Cell key={i} fill={UC_COLOR[d.use_case]} />
            ))}
          </Bar>
          <Bar dataKey="human" fill="#7E97A0" fillOpacity={0.4} radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
      <div className="text-[11px] text-slate-500 mt-1">
        {data[0] &&
          `Radiology leads the network by ${Math.max(...data.map((d) => d.delta_vs_network_avg_pts)).toFixed(1)} pts vs the Gulf-wide average.`}
      </div>
    </div>
  );
}
