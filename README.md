# 🛡️ Guardian AI

> AI-assisted emergency-response guidance. Describe an emergency in plain words,
> voice, or a photo — Guardian AI assesses severity, tells you what to do **right
> now**, and points you to the nearest help, grounded in first-aid guidance.

**This is a hackathon foundation build.** It runs end-to-end **today** with every
AI capability behind a mock service, and is architected so each mock can be
swapped for a real provider (Alibaba Cloud / Qwen / Qoder, maps, comms, a vector
DB) **tomorrow** by flipping an environment variable — no rewrites.

> ⚠️ **Not medical advice.** Guardian AI provides first-aid guidance and never
> replaces professional care. In a real emergency, call your local emergency
> service immediately. This build uses **simulated AI and mock data** for
> demonstration; no messages are actually sent and no one is really contacted.

---

## What it does (the 5 questions every assessment answers)

1. **What happened?** — incident type + a plain-language summary (and scene photo analysis).
2. **How serious is it?** — a clear priority (`CRITICAL` / `HIGH` / `MODERATE` / `LOW`) with danger signs and possible conditions.
3. **What should I do right now?** — prioritized, grounded first-aid steps.
4. **Where can I get help?** — the nearest capable hospital, with alternatives.
5. **Who has been notified?** — simulated family / hospital / emergency-service alerts + a hospital pre-alert.

Severity is always conveyed by **colour + icon + text label** (never colour
alone) and the app is fully bilingual (**English & Urdu**, with RTL) and
dark-mode aware.

---

## Status: what's real vs. mocked vs. future

| Area | ✅ Current MVP (real) | 🟡 Mocked (works, deterministic stand-in) | 🔮 Future (seam ready) |
|---|---|---|---|
| End-to-end flow | Full request → analysis → 5-answer UI | — | — |
| Orchestration | Real graph engine + agents (coordinator→vision→triage→…→report) | — | LangGraph / distributed agents |
| Triage logic | Rule-based severity + danger signs | Uses mock LLM reasoning text | Qwen LLM reasoning |
| Vision | Image-gated pipeline node | Deterministic scene detections | Qwen-VL / vision API |
| Speech-to-text | Endpoint + UI recorder | Canned transcript | Whisper / Qwen-Audio |
| Knowledge / RAG | Keyword retrieval over an in-code first-aid KB | — | FAISS + embeddings over `knowledge-base/` |
| Location / hospitals | Nearest-hospital selection | Static Lahore hospital set | Maps API |
| Notifications / pre-alert | Full status modelling | **Simulated** — nothing is sent | Real comms provider |
| Safety validation | Real safety-check node + cautious language | — | Expanded policy + red-team suite |
| i18n (EN/UR), dark mode, responsive, a11y | ✅ | — | more languages |

**Everything mocked is clearly labelled as mock in the UI and the API (`mock_mode: true`).**

📄 **Full done/remaining breakdown:** see [`docs/PROJECT_STATUS.md`](docs/PROJECT_STATUS.md).

---

## Architecture (at a glance)

```
guardian-ai/
├── backend/        FastAPI + Pydantic. Service abstractions with mock impls,
│   └── app/        swappable per-provider via env (the "tomorrow" seams).
│       ├── api/          REST routes  (/api/v1/…)
│       ├── schemas/      request/response contracts (mirrored by the frontend)
│       ├── services/     llm · vision · speech · rag · location · notification
│       │                 each: base interface + Mock impl + registry
│       ├── agents/       coordinator · vision · triage · report
│       ├── graph/        small orchestration engine + workflow + state
│       └── core/         config (env), logging (PII-safe)
├── frontend/       React + Vite + TypeScript + Tailwind + Framer Motion.
│   └── src/        api client is the ONLY module that calls fetch; all copy
│                   routes through the i18n dictionaries (no hardcoded strings).
├── knowledge-base/ first-aid source docs (raw/) → processed chunks (processed/)
├── evaluation/     demo scenarios + safety-test suite (§29)
└── docs/           architecture & integration notes
```

The frontend never talks to any AI service directly — it calls the backend.
The backend never talks to a concrete AI vendor directly — it calls a **service
interface** resolved by the registry from env. That is the whole extensibility
story: **flip `USE_MOCK_SERVICES=false` and select real providers** as
credentials arrive.

Full request flow and the swap-to-real guide live in [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

---

## Run it locally (verified path)

**Prerequisites:** Python 3.11+ and Node 18+.

### 1. Backend — FastAPI on `:8000`

```bash
cd backend
python -m venv .venv
# Windows:  .venv\Scripts\activate      macOS/Linux:  source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Health check → http://localhost:8000/api/v1/health · API docs → http://localhost:8000/docs

### 2. Frontend — Vite on `:5173`

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. The dev server proxies `/api` → the backend, so no
CORS setup is needed. No `.env` is required to run in mock mode.

### 3. Try it

Type an emergency (or pick a demo scenario), optionally attach a photo /
location / patient details, and hit **Analyze**. Toggle dark mode and switch to
اردو from the header.

---

## Run with Docker (optional)

```bash
docker compose up --build
```

Frontend → http://localhost:5173 (nginx serves the build and proxies `/api`
to the backend service).

---

## Configuration

All configuration is via environment variables — see [`.env.example`](.env.example).
Copy it to `.env` and fill values in as real services come online. Secrets are
**only** read from the environment / `.env`, never hard-coded.

## Security & privacy (spec §28 — enforced)

- `.env` is git-ignored; secrets come from the environment only.
- **Patient history and CNIC are never logged**; error messages are sanitized
  so internals/PII never leak to the client.
- No unnecessary personal data is stored (analyses live in an in-memory
  repository for the demo).
- Patient details entered in the UI are kept only for the session.
- All mock data is clearly labelled; test scenarios contain **no real patient
  information**.

## Tech stack

**Backend:** Python · FastAPI · Pydantic · pydantic-settings
**Frontend:** React 18 · Vite · TypeScript · Tailwind CSS · Framer Motion · lucide-react

---

_Built for the Bano Qabil hackathon. Designed to grow into a real Alibaba
Cloud / Qwen-powered system without re-architecting._
