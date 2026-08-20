# Guardian AI — Project Status

**Snapshot date:** 2026-08-20
**Stage:** Foundation build complete and running end-to-end in **mock mode**.
**Next milestone:** Swap mock AI services for real **Alibaba Cloud / Qwen / Qoder** providers.

> This document tracks what is implemented, what is deliberately mocked (and how
> to make it real), and what remains. It is the handoff/continuation reference
> for the hackathon.

---

## 1. TL;DR status

| Area | Status | Notes |
|---|---|---|
| Backend API (FastAPI) | ✅ Done | Runs on `:8000`, all endpoints working |
| Frontend (React/Vite/TS) | ✅ Done | Builds clean, runs on `:5173` |
| End-to-end mock flow | ✅ Done | Describe → analyze → 5-question result, verified |
| Frontend ↔ backend comms | ✅ Done | Dev proxy + full roundtrip verified (200s) |
| i18n (English + Urdu/RTL) | ✅ Done | No hardcoded strings; `ur` type-checked against `en` |
| Dark mode / responsive / a11y basics | ✅ Done | Persisted theme; colour+icon+text everywhere |
| Security & safety guardrails (§28/§31) | ✅ Done | Enforced in code + docs (see §5 below) |
| Project scaffolding & docs | ✅ Done | README, .env.example, .gitignore, Docker, docs |
| Evaluation harness | ✅ Done | `run_evals.py`, **11/11 checks pass** |
| Real AI services (LLM/vision/speech/RAG) | 🔮 Remaining | Interfaces + env seams ready; impls pending |
| Real location/maps & notifications | 🔮 Remaining | Interfaces ready; impls pending |
| Persistence / auth / automated unit tests / CI / deploy | 🔮 Remaining | Not started (see §6) |

---

## 2. ✅ What's been done

### A. Backend — FastAPI (`backend/app/`, 40 Python files)

- **API endpoints** (`app/api/routes.py`), all live and verified:
  - `GET  /api/v1/health` — service + provider status
  - `POST /api/v1/emergency/analyze` — the core analysis (returns the full contract)
  - `POST /api/v1/emergency/transcribe` — mock speech-to-text
  - `GET  /api/v1/emergency/scenarios` — 5 demo scenarios for the UI picker
  - `GET  /api/v1/emergency/session/{id}` — retrieve a stored analysis
  - Interactive docs at `/docs`.
- **Service abstraction layer** (`app/services/`) — the core extensibility design.
  Each capability is an interface + a Mock implementation, resolved at startup by
  a **registry** from environment config:
  `llm`, `vision`, `speech`, `rag`, `location`, `notification`.
- **Agent + graph orchestration** (`app/agents/`, `app/graph/`) — a small engine
  runs a real node graph:
  `coordinator → vision → triage → knowledge → location → safety → report → escalation → compose`
  (observable in each response's `meta.graph_path`).
- **Typed contracts** (`app/schemas/`) — Pydantic request/response models +
  enums (priority, incident type, severity, likelihood, notification state).
- **Config** (`app/core/config.py`) — env-driven via pydantic-settings; master
  `USE_MOCK_SERVICES` switch + per-provider selection + credential slots.
- **PII-safe logging** (`app/core/logging.py`) — patient history/CNIC never logged;
  `sanitize_error()` scrubs internals before they reach the client.
- **In-memory session repository** (`app/repositories/`) — stores analyses for
  the demo without persisting personal data.
- **Deterministic mock data** (`app/services/mock_data.py`) — first-aid knowledge
  corpus + hospital set + scene detections, so the whole app is offline & repeatable.

**Verified triage behaviour:** head-trauma + unresponsive → `CRITICAL`; cardiac →
`HIGH`; minor cut → `LOW`; each with sensible danger signs, actions, hospital,
and notifications.

### B. Frontend — React + Vite + TypeScript (`frontend/src/`, 52 files)

- **Single-page state machine** (`App.tsx`): `landing → emergency → analyzing →
  results`, with `AnimatePresence` page transitions (Framer Motion).
- **Three pages**: Landing (hero + how-it-works + the 5 questions + disclaimer),
  Emergency (text/voice/image input, demo scenarios, location, patient details,
  live summary sidebar), Results (the 5-question assessment).
- **The 5-question results UI**: incident summary + vision, priority card
  (animated confidence, pulse on critical), why-priority, danger signs, possible
  conditions (cautious likelihoods), immediate actions, clarifying questions
  (re-analyze), hospital + alternatives, notifications, hospital pre-alert,
  handover report (download/copy/share), sources, safety note.
- **API client** (`services/api.ts`) — the *only* module that calls `fetch`;
  typed against the backend contract; friendly network-error handling.
- **i18n** (`i18n/`) — English + Urdu dictionaries; `ur` is compile-time forced
  to mirror `en`; RTL handled; `document` lang/dir set; choice persisted.
- **Theme** (`hooks/useTheme.ts`) — dark mode persisted to localStorage +
  system-preference fallback; applied before first paint (no flash).
- **Design system** — Tailwind tokens for priority levels (CRITICAL deep-red,
  HIGH amber, MODERATE yellow, LOW green), burgundy primary reserved for brand,
  soft shadows, glass header, subtle animations. Severity is always
  **colour + icon + text label** (§31), never colour alone.
- **Mock input components** — voice recorder (simulated waveform → mock
  transcribe), image capture (upload/camera → data URL, handles scenario images),
  geolocation, patient history (privacy-noted, session-only).

### C. End-to-end integration & verification (done this session)

- `npm install` clean · `tsc --noEmit` → **0 errors** · `npm run build` → **exit 0**
  (1985 modules; 26 KB CSS with all priority + dark-mode tokens emitted).
- Both servers started; **frontend→backend proxy roundtrip verified** (health +
  full `analyze` through `:5173/api` → `:8000`, all 200).
- Response contract cross-checked against the TS types: all 23 fields present,
  `vision.usable`, image→vision path, no-image path all correct.

### D. Project scaffolding & documentation

- `README.md` — overview + **CURRENT MVP / MOCKED / FUTURE** status table + run
  instructions + security section (§33).
- `.env.example` — every config var documented with mock defaults; no secrets.
- `.gitignore` — ignores `.env`, venvs, `node_modules`, build output, and
  patient-data-shaped files (§28).
- `docker-compose.yml` + backend/frontend **Dockerfiles** + `nginx.conf`
  (nginx serves the SPA build and proxies `/api` to the backend service).
- `knowledge-base/` — `raw/` + `processed/` + README describing the RAG pipeline (§26).
- `evaluation/` — `demo_scenarios.json`, `safety-tests/safety_checks.json`, and a
  stdlib **runner `run_evals.py`** (§29).
- `docs/ARCHITECTURE.md` — layers, request flow, and the mock→real swap guide.

### E. Security & safety compliance (§28 / §31) — enforced

- Secrets only via env/`.env` (git-ignored); no hard-coded credentials.
- Patient history & CNIC never logged; error messages sanitized.
- No unnecessary personal data stored (in-memory only; UI details are session-only).
- All mock data clearly labelled (`mock_mode` / `meta.mock`).
- Non-diagnostic, cautious language always; medical disclaimer on every response;
  life-threatening cases flag *contact emergency services*; hospital pre-alerts
  are **simulated**.
- **Evaluation suite passes 11/11**, including these safety invariants.

---

## 3. 🟡 What's mocked (and the seam to make it real)

Everything below **works today** with a deterministic stand-in. Each is swapped
by implementing its interface and setting env — nothing upstream changes.

| Capability | Interface (`backend/app/services/`) | Env to go real | Real target |
|---|---|---|---|
| LLM reasoning | `llm_service.py` | `LLM_PROVIDER=qwen` + `LLM_API_KEY/BASE_URL/MODEL` | Alibaba Qwen |
| Vision (scene photo) | `vision_service.py` | `VISION_PROVIDER=qwen-vl` + `VISION_*` | Qwen-VL |
| Speech-to-text | `speech_service.py` | `SPEECH_PROVIDER=whisper` | Whisper / Qwen-Audio |
| Knowledge / RAG | `rag_service.py` | `RAG_PROVIDER=faiss` + `EMBEDDINGS_MODEL` | FAISS over `knowledge-base/` |
| Location / hospitals | `location_service.py` | `LOCATION_PROVIDER=maps` + `MAPS_API_KEY` | Maps/places API |
| Notifications | `notification_service.py` | `NOTIFICATION_PROVIDER=<comms>` | SMS/voice/hospital comms |

Master switch: `USE_MOCK_SERVICES=false` turns on per-provider selection.

---

## 4. 🔮 What's remaining (prioritized)

### Tier 1 — Real AI integration (the "tomorrow" core work)
- [ ] **LLM (Qwen)**: implement `QwenLlmService(LlmService)`; wire incident
      classification + triage reasoning + summary generation to real inference;
      register as `"qwen"`. Add `dashscope`/SDK to `requirements.txt`.
- [ ] **Vision (Qwen-VL)**: real scene analysis from uploaded image bytes
      (frontend already sends a data URL; backend currently mock-detects).
- [ ] **Speech-to-text**: real transcription of recorded audio (frontend recorder
      is currently a simulated waveform; wire actual audio capture + upload).
- [ ] **RAG**: populate `knowledge-base/raw/` with authoritative first-aid sources
      → clean/chunk/embed into `processed/` → FAISS retrieval in `rag_service`.
- [ ] **Prompt/safety hardening** for real models: keep non-diagnostic guarantees,
      grounding, and cautious language under real generation; expand red-team tests.
- [ ] Consider real **LangGraph** orchestration (dep already commented in requirements).

### Tier 2 — Real external services
- [ ] **Location/maps**: real geocoding + nearest-hospital lookup with capabilities/ETA.
- [ ] **Notifications**: real (opt-in, consented) family/hospital/emergency comms;
      keep pre-alert simulated until explicitly authorized for production.

### Tier 3 — Productionization
- [ ] **Persistence**: replace the in-memory repository with a real store
      (interface already exists in `app/repositories/`). Mind §28 — store the
      minimum, encrypt sensitive fields, define retention.
- [ ] **Auth / rate limiting** if the API is exposed publicly.
- [ ] **Automated tests**: backend unit tests (services, agents, graph) and
      frontend component tests — currently only the end-to-end eval harness exists.
- [ ] **CI/CD**: run typecheck + build + `run_evals.py` on every push (no CI yet).
- [ ] **Deployment**: Alibaba Cloud (containers already build; add cloud config,
      secrets management, HTTPS, observability).
- [ ] **Real image/audio upload pipeline**: size limits, validation, storage/TTL.

### Tier 4 — Polish & stretch
- [ ] Formal **accessibility audit** (keyboard, screen-reader, contrast) beyond current basics.
- [ ] More **languages** (architecture already supports it).
- [ ] Offline/poor-connectivity handling; retries; graceful degradation.
- [ ] Analytics/telemetry (privacy-preserving), and a real handover-to-responder channel.

---

## 5. 📋 How to run & verify (quick reference)

```bash
# Backend  → http://localhost:8000   (docs at /docs)
cd backend && python -m venv .venv && .venv\Scripts\activate   # (venv already present)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000

# Frontend → http://localhost:5173
cd frontend && npm install && npm run dev

# Verify (backend must be running)
python evaluation/run_evals.py --base http://localhost:8000     # expect 11/11 pass
cd frontend && npm run build                                    # expect exit 0

# Or everything via containers
docker compose up --build
```

---

## 6. ⚠️ Known limitations (by design, for the demo)

- All AI output is deterministic mock data — labelled as such throughout.
- Notifications and hospital pre-alerts are **simulated**; nobody is contacted.
- Sessions and analyses live **in memory** — they reset when the backend restarts.
- Hospital data is a fixed Lahore set; location defaults to Lahore.
- The voice recorder produces a synthetic waveform + canned transcript.
- No automated unit tests or CI yet (the eval harness is the current safety net).
- `knowledge-base/raw` and `processed` are empty placeholders; mock RAG uses the
  in-code corpus.

---

## 7. 🗺️ Suggested next-session plan

1. Obtain Alibaba Cloud / Qwen credentials; put them in `.env` (never commit).
2. Implement `QwenLlmService` first (biggest impact); flip `LLM_PROVIDER=qwen`
   with `USE_MOCK_SERVICES=false` and keep other providers on mock.
3. Re-run `evaluation/run_evals.py` — the safety invariants must still pass with
   real generation. Tighten prompts until they do.
4. Add Qwen-VL vision, then real RAG (populate the knowledge base).
5. Layer in persistence + tests + CI, then deploy to Alibaba Cloud.

_The architecture was built so steps 2–4 require no changes to the agents,
graph, routes, or frontend — only new service implementations behind the
existing interfaces._
