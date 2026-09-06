"""
Real Rails — FDA AI/ML-Enabled Device Registry
================================================
This module serves REAL, sourced data (unlike data_store.py, which serves
the illustrative/mock deployment dataset). See fda_registry.json for the
source URL and snapshot caveats.
"""
import json
from pathlib import Path
from functools import lru_cache

DATA_DIR = Path(__file__).parent / "data"
FDA_REGISTRY_PATH = DATA_DIR / "fda_registery.json"


@lru_cache(maxsize=1)
def _raw() -> dict:
    try:
        with open(FDA_REGISTRY_PATH, "r") as f:
            return json.load(f)
    except Exception:
        return {"source": {}, "devices": []}


def get_source_info() -> dict:
    return _raw()["source"]


def get_fda_devices(specialty: str | None = None) -> list[dict]:
    devices = _raw()["devices"]
    if specialty:
        devices = [d for d in devices if d["specialty"] == specialty]
    return devices


def get_fda_registry_full() -> dict:
    return _raw()