"""
Real Rails — Clinical AI Diagnostics Adoption Monitor
FastAPI backend. Serves the "Intelligence Layer" API consumed by the
Next.js frontend's map, charts and sidebar.

Run:
    uvicorn app.main:app --reload --port 8000
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os

from .routers import rail

app = FastAPI(
    title="Real Rails — Clinical AI Diagnostics Adoption Monitor",
    description="Deployment, concordance and time-to-report telemetry for AI-assisted radiology, pathology and triage across Gulf health systems.",
    version="1.0.0",
)

# CORS: frontend origin is configurable via env, never hardcoded beyond localhost dev default.
origins = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(rail.router)


@app.get("/")
def root():
    return {"status": "ok", "service": "real-rails-clinical-ai-backend"}


@app.get("/health")
def health():
    return {"status": "healthy"}
