# Knowledge Base (first-aid guidance)

Guardian AI grounds its guidance in trusted first-aid references rather than free
generation. This directory is the pipeline for that knowledge (spec §26).

```
knowledge-base/
├── raw/        Source documents as collected (PDF/HTML/txt). Git-ignored.
└── processed/  Cleaned, chunked, embedded artifacts for retrieval. Git-ignored.
```

## Current MVP (mock mode)

The retrieval-augmented step currently runs against a small, in-code first-aid
corpus (`backend/app/services/mock_data.py`) using keyword scoring. This keeps
the demo fully offline and deterministic — every assessment still cites real
guidance topics (scene safety, bleeding control, CPR/recovery position, burns,
etc.) with a source label and link.

## Future (seam ready)

When real retrieval comes online:

1. **Collect** authoritative sources into `raw/` — e.g. WHO *Basic Emergency
   Care*, Red Cross / St John first-aid manuals, local emergency-service (1122)
   guidance. Record provenance and licensing.
2. **Process** into `processed/` — clean → chunk → embed (embeddings model from
   `EMBEDDINGS_MODEL`) → build a FAISS index.
3. **Serve** by setting `RAG_PROVIDER=faiss` and `USE_MOCK_SERVICES=false`. The
   `RagService` interface (`backend/app/services/rag_service.py`) stays the same,
   so nothing upstream changes.

## Sourcing rules

- Prefer primary, authoritative medical/first-aid sources; record the citation.
- Respect each source's licence before redistributing.
- **Never** place real patient data here (§28). This corpus is guidance only.
