from fastapi import APIRouter, Query
from fastapi.responses import JSONResponse
from typing import Literal, Optional

from .. import data_store
from .. import fda_registry

router = APIRouter(prefix="/api", tags=["clinical-ai-rail"])

UseCase = Literal["radiology", "pathology", "triage"]


@router.get("/meta")
def meta():
    return data_store.get_meta()


@router.get("/facilities")
def facilities(use_case: Optional[UseCase] = Query(default=None)):
    return data_store.get_facilities_geojson(use_case)


@router.get("/adoption-trend")
def adoption_trend():
    return data_store.get_adoption_trend()


@router.get("/concordance")
def concordance():
    return data_store.get_concordance()


@router.get("/time-to-report")
def time_to_report():
    return data_store.get_time_to_report()


@router.get("/coverage-matrix")
def coverage_matrix():
    return data_store.get_coverage_matrix()


@router.get("/sample-data")
def sample_data():
    data = data_store.get_full_sample_export()
    return JSONResponse(
        content=data,
        headers={"Content-Disposition": "attachment; filename=clinical-ai-adoption-sample-data.json"},
    )


@router.get("/fda-registry")
def fda_registry_endpoint(specialty: Optional[UseCase] = Query(default=None)):
    """REAL data (not mock): sourced FDA-cleared AI/ML device snapshot."""
    return {
        "source": fda_registry.get_source_info(),
        "devices": fda_registry.get_fda_devices(specialty),
    }