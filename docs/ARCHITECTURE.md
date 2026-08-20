# Guardian AI — Architecture

This document explains how the system is put together and, most importantly,
**how each mocked capability becomes a real one** without changing the code that
depends on it. That extensibility is the whole point of the foundation build.

---

## 1. Layers

```
Browser (React SPA)
   │  fetch  (only via src/services/api.ts)
   ▼
FastAPI  /api/v1/*                         ← app/api/routes.py
   │
   ▼
Analysis orchestration  (graph engine)     ← app/graph/*, app/agents/*
   │  every capability is called through an INTERFACE, never a vendor directly
   ▼
Service registry  →  {llm, vision, speech, rag, location, notification}
                     each = base interface + Mock impl (+ future real impls)
```

Two hard rules keep the layers swappable:

- **Frontend:** only `src/services/api.ts` calls `fetch`. UI components and hooks
  consume typed results; they never know a URL. All user-facing copy comes from
  the i18n dictionaries (`src/i18n/*`) — no hardcoded strings.
- **Backend:** business logic depends on **service interfaces**
  (`app/services/base.py` and the per-service modules), never on a concrete
  vendor SDK. The **registry** (`app/services/registry.py`) picks the
  implementation from config at startup.

---

## 2. Request flow (POST `/api/v1/emergency/analyze`)

The orchestration graph runs these nodes (observable in `meta.graph_path`):

```
coordinator → vision → triage → knowledge → location → safety → report
            → escalation → coordinator:compose
```

| Node | Responsibility | Service used |
|---|---|---|
| **coordinator** | classify incident, set up shared state | llm |
| **vision** | analyze the scene photo (only if an image was provided) | vision |
| **triage** | severity, danger signs, possible conditions, "why" | llm (rules) |
| **knowledge** | retrieve grounding first-aid guidance | rag |
| **location** | choose nearest capable hospital + alternatives | location |
| **safety** | validate output, decide emergency-service escalation | — |
| **report** | build the handover report + notifications/pre-alert | notification |
| **escalation** | finalize contact-emergency decision | — |
| **coordinator:compose** | assemble the final response contract | — |

The response is a single typed object (`app/schemas/emergency.py`) mirrored on
the frontend (`src/types/emergency.ts`) — the contract both sides agree on.

The UI presents this as the **five questions**: what happened, how serious, what
to do now, where to get help, who's been notified.

---

## 3. The mock → real seam

`app/core/config.py` reads env vars. The master switch is `USE_MOCK_SERVICES`.

```
USE_MOCK_SERVICES=true    → registry returns Mock* for every service (today)
USE_MOCK_SERVICES=false   → registry returns the impl named per provider var
```

To bring a capability online **tomorrow**:

1. Implement the interface (e.g. a `QwenLlmService(LlmService)` in
   `app/services/llm_service.py`) using the real SDK/endpoint.
2. Register it in the registry under a provider name (e.g. `"qwen"`).
3. Set env: `USE_MOCK_SERVICES=false`, `LLM_PROVIDER=qwen`, `LLM_API_KEY=…`,
   `LLM_BASE_URL=…`, `LLM_MODEL=…`.

Nothing in the agents, graph, routes, or frontend changes — they only ever saw
the interface. You can mix and match (e.g. real LLM, still-mock notifications)
because each provider is selected independently.

Planned real providers (seams already present in `.env.example`):

| Service | Env provider | Likely real impl |
|---|---|---|
| llm | `qwen` | Alibaba Qwen (DashScope-compatible) |
| vision | `qwen-vl` | Qwen-VL |
| speech | `whisper` / `qwen-audio` | Whisper / Qwen-Audio |
| rag | `faiss` | FAISS over `knowledge-base/processed/` |
| location | `maps` | Maps/places API |
| notification | (comms) | SMS/voice/hospital integration |

---

## 4. Frontend structure

```
src/
├── services/api.ts     the only fetch boundary
├── types/emergency.ts  TS mirror of the backend contract
├── i18n/               en + ur dictionaries (ur is type-checked to match en)
├── hooks/              analysis, geolocation, voice, theme
├── animations/         shared Framer Motion variants
├── lib/                priority metadata (colour+icon+label), report builder
├── components/         ui primitives · layout · input · emergency/results
└── pages/              Landing · Emergency · Results  (single-page state machine)
```

Design guarantees: dark mode (persisted + system-aware), bilingual EN/UR with
RTL, severity shown as **colour + icon + text** (never colour alone), subtle/fast
motion, responsive/mobile-first.

---

## 5. Security & privacy (spec §28)

- Secrets only from env / `.env` (git-ignored). No hard-coded credentials.
- **Patient history and CNIC are never logged.** Logging is PII-aware
  (`app/core/logging.py`) and error messages are sanitized before reaching the
  client (`sanitize_error`).
- Analyses are held in an in-memory repository for the demo — no unnecessary
  persistence of personal data.
- Mock data is labelled everywhere (`mock_mode` / `meta.mock`); test and demo
  data contain no real patient information.

---

## 6. Safety posture (spec §31)

Guidance is **non-diagnostic**: possible conditions carry cautious likelihoods
(`POSSIBLE` / `SUSPECTED` / `UNLIKELY`), never a definitive diagnosis. A medical
disclaimer accompanies every response, life-threatening cases flag *contact
emergency services*, and hospital pre-alerts are **simulated** for the demo. See
`evaluation/safety-tests/` for the invariants encoded as checks.
