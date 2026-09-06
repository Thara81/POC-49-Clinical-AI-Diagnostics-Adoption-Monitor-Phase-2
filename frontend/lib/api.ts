import {
  FacilityCollection,
  AdoptionTrendPoint,
  ConcordanceRow,
  TimeToReport,
  CoverageRow,
  Meta,
  UseCase,
  FdaRegistry,
} from "./types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

async function safeFetch<T>(path: string, fallback: () => Promise<T>): Promise<T> {
  try {
    const res = await fetch(`${API_BASE}${path}`, { cache: "no-store" });
    if (!res.ok) throw new Error(`API ${path} returned ${res.status}`);
    return (await res.json()) as T;
  } catch {
    return fallback();
  }
}

async function loadLocalMock() {
  const res = await fetch("/mock_data.json");
  return res.json();
}

export async function getMeta(): Promise<Meta> {
  return safeFetch<Meta>("/api/meta", async () => (await loadLocalMock()).meta);
}

export async function getFacilities(useCase?: UseCase): Promise<FacilityCollection> {
  const qs = useCase ? `?use_case=${useCase}` : "";
  return safeFetch<FacilityCollection>(`/api/facilities${qs}`, async () => {
    const raw = await loadLocalMock();
    const features = raw.facilities
      .filter((f: any) => !useCase || Boolean(f.deployments[useCase]))
      .map((f: any) => {
        const liveCount = Object.values(f.deployments).filter(Boolean).length;
        return {
          type: "Feature",
          geometry: { type: "Point", coordinates: [f.lon, f.lat] },
          properties: {
            id: f.id,
            name: f.name,
            country: f.country,
            city: f.city,
            deployments: f.deployments,
            live_use_cases: liveCount,
            coverage_pct_of_use_cases: Math.round((liveCount / 3) * 1000) / 10,
          },
        };
      });
    return { type: "FeatureCollection", features };
  });
}

export async function getAdoptionTrend(): Promise<AdoptionTrendPoint[]> {
  return safeFetch<AdoptionTrendPoint[]>("/api/adoption-trend", async () => (await loadLocalMock()).adoption_trend);
}

export async function getConcordance(): Promise<ConcordanceRow[]> {
  return safeFetch<ConcordanceRow[]>("/api/concordance", async () => {
    const rows = (await loadLocalMock()).concordance;
    const avg = rows.reduce((s: number, r: any) => s + r.ai, 0) / rows.length;
    return rows.map((r: any) => ({
      ...r,
      gap_to_human: Math.round((r.human - r.ai) * 10) / 10,
      delta_vs_network_avg_pts: Math.round((r.ai - avg) * 10) / 10,
    }));
  });
}

export async function getTimeToReport(): Promise<TimeToReport> {
  return safeFetch<TimeToReport>("/api/time-to-report", async () => {
    const ttr = (await loadLocalMock()).time_to_report;
    const out: any = {};
    const improvements: number[] = [];
    for (const [useCase, v] of Object.entries<any>(ttr)) {
      const pct = Math.round((1 - v.assisted_min / v.baseline_min) * 100);
      improvements.push(pct);
      out[useCase] = { ...v, improvement_pct: pct };
    }
    out._network_avg_improvement_pct = Math.round(
      improvements.reduce((s, v) => s + v, 0) / improvements.length
    );
    return out;
  });
}

export async function getCoverageMatrix(): Promise<CoverageRow[]> {
  return safeFetch<CoverageRow[]>("/api/coverage-matrix", async () => {
    const facilities = (await loadLocalMock()).facilities;
    return facilities.map((f: any) => ({
      id: f.id,
      name: f.name,
      country: f.country,
      coverage: {
        radiology: Boolean(f.deployments.radiology),
        pathology: Boolean(f.deployments.pathology),
        triage: Boolean(f.deployments.triage),
      },
    }));
  });
}

export function sampleDataDownloadUrl(): string {
  return `${API_BASE}/api/sample-data`;
}

export async function getFdaRegistry(specialty?: UseCase): Promise<FdaRegistry> {
  const qs = specialty ? `?specialty=${specialty}` : "";
  return safeFetch<FdaRegistry>(`/api/fda-registry${qs}`, async () => {
    const res = await fetch("/fda_registry.json");
    const raw = await res.json();
    const devices = specialty
      ? raw.devices.filter((d: any) => d.specialty === specialty)
      : raw.devices;
    return { source: raw.source, devices };
  });
}