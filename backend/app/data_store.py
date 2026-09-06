"""
Data orchestration layer.

Guardrail (Real Rails Doc 4 — Mock Fallback): if MOCK_DATA_PATH can't be read,
or a future live-source fetch fails, we fall back to the bundled mock_data.json
so the UI never breaks mid-demo.
"""
import json
import os
from pathlib import Path
from functools import lru_cache

import pandas as pd

DATA_DIR = Path(__file__).parent / "data"
MOCK_DATA_PATH = DATA_DIR / "mock_data.json"


@lru_cache(maxsize=1)
def _raw() -> dict:
    try:
        with open(MOCK_DATA_PATH, "r") as f:
            return json.load(f)
    except Exception:
        # Mock fallback guardrail: never let the API 500 the dashboard.
        return {
            "meta": {"rail": "Clinical AI", "poc_title": "Clinical AI Diagnostics Adoption Monitor", "sources": [], "note": "fallback-empty"},
            "facilities": [],
            "adoption_trend": [],
            "concordance": [],
            "time_to_report": {},
        }


def get_meta() -> dict:
    return _raw()["meta"]


def get_facilities_geojson(use_case: str | None = None) -> dict:
    """Return facilities as a GeoJSON FeatureCollection, optionally filtered
    to facilities with a live deployment for a given use case."""
    df = pd.DataFrame(_raw()["facilities"])
    if use_case:
        df = df[df["deployments"].apply(lambda d: bool(d.get(use_case)))]

    features = []
    for _, row in df.iterrows():
        deployments = row["deployments"]
        live_count = sum(1 for v in deployments.values() if v)
        features.append({
            "type": "Feature",
            "geometry": {"type": "Point", "coordinates": [row["lon"], row["lat"]]},
            "properties": {
                "id": row["id"],
                "name": row["name"],
                "country": row["country"],
                "city": row["city"],
                "deployments": deployments,
                "live_use_cases": live_count,
                # intelligence layer: don't just show a count, show it relative to the network
                "coverage_pct_of_use_cases": round(live_count / 3 * 100, 1),
            },
        })
    return {"type": "FeatureCollection", "features": features}


def get_adoption_trend() -> list[dict]:
    return _raw()["adoption_trend"]


def get_concordance() -> list[dict]:
    """Concordance benchmark + intelligence layer: AI concordance expressed
    relative to the Gulf-wide average across use cases, not just an absolute %."""
    rows = _raw()["concordance"]
    avg = sum(r["ai"] for r in rows) / len(rows) if rows else 0
    out = []
    for r in rows:
        out.append({
            **r,
            "gap_to_human": round(r["human"] - r["ai"], 1),
            "delta_vs_network_avg_pts": round(r["ai"] - avg, 1),
        })
    return out


def get_time_to_report() -> dict:
    """Time-to-report + intelligence layer: convert raw minutes into a
    percentage-improvement metric per use case, plus a network-wide figure."""
    ttr = _raw()["time_to_report"]
    out = {}
    improvements = []
    for use_case, v in ttr.items():
        pct = round((1 - v["assisted_min"] / v["baseline_min"]) * 100)
        improvements.append(pct)
        out[use_case] = {**v, "improvement_pct": pct}
    out["_network_avg_improvement_pct"] = round(sum(improvements) / len(improvements)) if improvements else 0
    return out


def get_coverage_matrix() -> list[dict]:
    facilities = _raw()["facilities"]
    return [
        {
            "id": f["id"],
            "name": f["name"],
            "country": f["country"],
            "coverage": {uc: bool(f["deployments"].get(uc)) for uc in ("radiology", "pathology", "triage")},
        }
        for f in facilities
    ]


def get_full_sample_export() -> dict:
    """Everything the sidebar 'Download Sample Data' button needs in one file."""
    return _raw()
