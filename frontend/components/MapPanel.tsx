"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, CircleMarker, Tooltip as LeafletTooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { FacilityCollection, FacilityProperties, UseCase } from "@/lib/types";
import { getFacilities } from "@/lib/api";

const UC_COLOR: Record<UseCase, string> = {
  radiology: "#38BDF8",
  pathology: "#F59E0B",
  triage: "#818CF8",
};

export default function MapPanel({
  activeUseCase,
  onSelectFacility,
}: {
  activeUseCase: UseCase | "all";
  onSelectFacility: (facility: FacilityProperties) => void;
}) {
  const [data, setData] = useState<FacilityCollection | null>(null);

  useEffect(() => {
    let cancelled = false;
    getFacilities(activeUseCase === "all" ? undefined : activeUseCase).then((d) => {
      if (!cancelled) setData(d);
    });
    return () => {
      cancelled = true;
    };
  }, [activeUseCase]);

  return (
    <div className="fixed inset-0 rr-leaflet-dark">
      <MapContainer
        center={[24.8, 51.5]}
        zoom={5}
        scrollWheelZoom={true}
        zoomControl={false}
        style={{ height: "100vh", width: "100vw", background: "#071A20" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {data?.features.map((f) => {
          const [lon, lat] = f.geometry.coordinates;
          const p = f.properties;
          const color = activeUseCase === "all" ? "#2DD4BF" : UC_COLOR[activeUseCase as UseCase];
          return (
            <CircleMarker
              key={p.id}
              center={[lat, lon]}
              radius={7 + p.live_use_cases * 2.2}
              pathOptions={{ color, fillColor: color, fillOpacity: 0.4, weight: 1.5 }}
              eventHandlers={{
                click: () => onSelectFacility(p),
              }}
            >
              <LeafletTooltip direction="top" opacity={1}>
                <div className="text-xs">
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-slate-500">{p.city}, {p.country} — click for detail</div>
                </div>
              </LeafletTooltip>
            </CircleMarker>
          );
        })}
      </MapContainer>

      {/* Floating status chip — top-left, clear of the header */}
      <div className="absolute top-20 left-4 sm:left-6 rr-card px-3 py-2 pointer-events-none">
        <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-slate-400">
          Deployment footprint — Gulf region
        </div>
        <div className="font-mono text-[13px] text-brandTeal mt-0.5">
          {data ? `${data.features.length} facilities` : "loading…"}
        </div>
      </div>
    </div>
  );
}