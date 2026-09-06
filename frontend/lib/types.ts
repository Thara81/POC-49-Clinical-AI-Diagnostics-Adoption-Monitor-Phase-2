export type UseCase = "radiology" | "pathology" | "triage";

export interface FacilityProperties {
  id: string;
  name: string;
  country: string;
  city: string;
  deployments: Record<UseCase, string | null>;
  live_use_cases: number;
  coverage_pct_of_use_cases: number;
}

export interface FacilityFeature {
  type: "Feature";
  geometry: { type: "Point"; coordinates: [number, number] };
  properties: FacilityProperties;
}

export interface FacilityCollection {
  type: "FeatureCollection";
  features: FacilityFeature[];
}

export interface AdoptionTrendPoint {
  month: string;
  radiology: number;
  pathology: number;
  triage: number;
}

export interface ConcordanceRow {
  use_case: UseCase;
  ai: number;
  human: number;
  n: number;
  gap_to_human: number;
  delta_vs_network_avg_pts: number;
}

export interface TTREntry {
  baseline_min: number;
  assisted_min: number;
  improvement_pct: number;
}

export interface TimeToReport {
  radiology: TTREntry;
  pathology: TTREntry;
  triage: TTREntry;
  _network_avg_improvement_pct: number;
}

export interface CoverageRow {
  id: string;
  name: string;
  country: string;
  coverage: Record<UseCase, boolean>;
}

export interface Meta {
  rail: string;
  poc_title: string;
  sources: string[];
  note: string;
}

export interface FdaSource {
  name: string;
  url: string;
  publisher: string;
  snapshot_note: string;
  as_of: string;
}

export interface FdaDevice {
  manufacturer: string;
  product_line: string;
  specialty: UseCase;
  modality: string;
}

export interface FdaRegistry {
  source: FdaSource;
  devices: FdaDevice[];
}