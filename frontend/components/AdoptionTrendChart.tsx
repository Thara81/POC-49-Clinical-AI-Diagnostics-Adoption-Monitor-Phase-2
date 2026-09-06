"use client";

import { useEffect, useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { AdoptionTrendPoint } from "@/lib/types";
import { getAdoptionTrend } from "@/lib/api";
import { CardEyebrow, CardTitle } from "@/components/ui/card";

const UC_COLOR: Record<string, string> = {
  radiology: "#38BDF8",
  pathology: "#F59E0B",
  triage: "#818CF8",
};
const UC_LABEL: Record<string, string> = {
  radiology: "Radiology",
  pathology: "Pathology",
  triage: "Triage",
};

export default function AdoptionTrendChart() {
  const [data, setData] = useState<AdoptionTrendPoint[]>([]);
  useEffect(() => {
    getAdoptionTrend().then(setData);
  }, []);

  return (
    <div className="rr-card p-5">
      <CardEyebrow>Deployment trajectory</CardEyebrow>
      <CardTitle>Adoption rate by use case</CardTitle>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 4, right: 12, left: -18, bottom: 0 }}>
          <CartesianGrid stroke="#1F2937" strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="month" tick={{ fill: "#7E97A0", fontSize: 11 }} axisLine={{ stroke: "#1F2937" }} tickLine={false} />
          <YAxis tick={{ fill: "#7E97A0", fontSize: 11 }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip contentStyle={{ background: "#030712", border: "1px solid #1F2937", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "#E6EDF3" }} />
          <Legend formatter={(v) => <span className="text-slate-400 text-xs">{UC_LABEL[v as string]}</span>} />
          {(["radiology", "pathology", "triage"] as const).map((uc) => (
            <Line key={uc} type="monotone" dataKey={uc} stroke={UC_COLOR[uc]} strokeWidth={2.2} dot={false} />
          ))}
        </LineChart>
      </ResponsiveContainer>
      <div className="text-[11px] text-slate-500 mt-1">
        Share of eligible facilities with a live tool in production, Jan–Dec (mock).
      </div>
    </div>
  );
}
