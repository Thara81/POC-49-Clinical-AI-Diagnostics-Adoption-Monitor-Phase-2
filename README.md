# Real Rails — Clinical AI Diagnostics Adoption Monitor

**Rail:** Clinical AI
**Stack:** Next.js 14 (App Router, TypeScript, Tailwind, shadcn-style components) · Leaflet · Recharts · FastAPI + Pandas

Deployment, concordance and time-to-report telemetry for AI-assisted radiology,
pathology and triage across Gulf health systems. Built to the Real Rails DNA:
obsidian/cyan fintech-terminal theme, 70/30 main-stage/sidebar layout, live
API with an automatic mock-data fallback.

## Repo layout

```
real-rails-clinical-ai/
├── backend/                 FastAPI service
│   ├── app/
│   │   ├── main.py          App entrypoint, CORS
│   │   ├── data_store.py    Pandas-based "intelligence layer" transforms
│   │   ├── routers/rail.py  /api/* endpoints
│   │   └── data/mock_data.json
│   ├── requirements.txt
│   └── .env.example
└── frontend/                 Next.js app
    ├── app/                  page.tsx (dashboard), layout.tsx, globals.css
    ├── components/           MapPanel, AdoptionTrendChart, ConcordanceChart,
    │                         TTRGauges, CoverageMatrix, Sidebar, ui/*
    ├── lib/                  api.ts (fetch + mock fallback), types.ts
        ├── public/mock_data.json client-side fallback copy
        ├── public/fda_registry.json client-side FDA fallback copy
    └── .env.local.example
```

## Docker prerequisites

- Docker Desktop with Docker Compose v2 (`docker compose version`)
- Ports `3000` and `8000` available on the host

## Docker setup

The browser calls the backend through the host-published URL, so the default
frontend API base is `http://localhost:8000`. The Compose service name
`backend` is available for container-to-container traffic, but it must not be
used as the browser's `NEXT_PUBLIC_API_BASE`.

Copy the example environment files if you need to override the defaults:

```bash
cp backend/.env.example backend/.env
cp frontend/.env.local.example frontend/.env.local
```

Do not commit either generated file. For Docker, the root `.env` file can
override Compose defaults without being copied into either image:

```dotenv
FRONTEND_ORIGIN=http://localhost:3000
NEXT_PUBLIC_API_BASE=http://localhost:8000
```

Build and start both services:

```bash
docker compose build
docker compose up -d
```

Open the application at http://localhost:3000. The backend is available at
http://localhost:8000, with interactive API documentation at
http://localhost:8000/docs and health status at http://localhost:8000/health.

Useful lifecycle and diagnostics commands:

```bash
docker compose ps
docker compose logs -f
docker compose logs -f frontend
docker compose logs -f backend
docker compose restart
docker compose stop
docker compose down
docker compose up -d --build
```

The API endpoints remain available under `http://localhost:8000/api/`, including
`/api/facilities`, `/api/adoption-trend`, `/api/concordance`,
`/api/time-to-report`, `/api/coverage-matrix`, `/api/fda-registry`, and
`/api/sample-data`.

### Docker troubleshooting

- If the frontend shows fallback data, verify `NEXT_PUBLIC_API_BASE` is
    `http://localhost:8000`, rebuild the frontend, and inspect
    `docker compose logs frontend`.
- If the backend is unhealthy, run `docker compose logs backend` and check
    that port `8000` is not already in use.
- If the browser reports CORS errors, set `FRONTEND_ORIGIN` to the exact
    browser origin, such as `http://localhost:3000`, then restart the stack.
- If a changed build setting appears ignored, use
    `docker compose up -d --build` because `NEXT_PUBLIC_API_BASE` is embedded
    into the browser bundle during `next build`.
- The map uses public OpenStreetMap tiles and requires no API key; tile
    availability still depends on network access from the browser.

## Run it without Docker

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
```

**Frontend** (separate terminal)
```bash
cd frontend
npm install
cp .env.local.example .env.local
npm run dev
```

Open http://localhost:3000. If the backend isn't running, the dashboard
still works off the bundled mock data (Doc 4 — Mock Fallback guardrail).

## API

| Endpoint                | Returns |
|--------------------------|---------|
| `GET /api/meta`          | Rail metadata + data sources |
| `GET /api/facilities`    | GeoJSON FeatureCollection (optional `?use_case=radiology\|pathology\|triage`) |
| `GET /api/adoption-trend`| Monthly adoption % by use case |
| `GET /api/concordance`   | AI vs. specialist concordance + network-average delta |
| `GET /api/time-to-report`| Baseline vs. AI-assisted minutes + improvement % |
| `GET /api/coverage-matrix`| Facility × use-case live/not-live grid |
| `GET /api/sample-data`   | Full dataset, powers the sidebar download button |

## Data sources (ingest targets for a production build)

- WHO — Ethics and Governance of Artificial Intelligence for Health
- Gulf digital-health transformation reports (UAE, KSA, Qatar national strategies)
- FDA AI/ML-Enabled Medical Device List
- EU CE-Mark (MDR) diagnostic device registry

All facility names are real institutions used for illustrative map placement.
Tool names, deployment status, concordance figures and time-to-report metrics
are **synthetic mock data** — see `meta.note` in `mock_data.json`.

## Final verification checklist (Real Rails Doc 4)

- [x] Background is `#030712`
- [x] Sidebar occupies exactly 30% width (`lg:col-span-3` of 10 on a 70/30 grid)
- [x] Filters (Section D) update the map without a full page refresh — client-state driven fetch
- [x] Map uses a professional projection library (Leaflet + OpenStreetMap tiles), no manual SVG/lat-lon math
- [x] No hardcoded credentials — OSM tiles need no key; `.env.example` documents the only configurable value (frontend origin / API base)
