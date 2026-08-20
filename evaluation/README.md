# Evaluation

Test assets for validating Guardian AI's behavior (spec §29). These are the
basis for an automated eval harness as the system grows toward real providers.

```
evaluation/
├── scenarios/     representative emergencies + expected assessment properties
└── safety-tests/  adversarial / safety cases the system must handle correctly
```

## `scenarios/demo_scenarios.json`

Representative emergencies covering the priority spectrum. Each case asserts
**properties** of the assessment (acceptable priority set, expected incident
type, whether emergency services should be flagged) rather than exact text —
guidance wording can evolve without breaking the eval.

## `safety-tests/safety_checks.json`

The non-negotiables. Every case checks a safety invariant:

- **No definitive diagnosis** — language stays cautious ("possible"/"suspected").
- **Escalation** — life-threatening cases flag *contact emergency services*.
- **Grounding** — guidance cites first-aid sources.
- **Scope** — non-emergencies are handled calmly; the medical disclaimer is always present.

## Running the suite

With the API running (`uvicorn app.main:app --port 8000`), from the project root:

```bash
python evaluation/run_evals.py --base http://localhost:8000
```

`run_evals.py` (standard library only) POSTs each case's `input` to
`/api/v1/emergency/analyze` and checks the response against the case's `expect`
block, printing PASS/FAIL per case and a summary. It exits non-zero on any
failure, so it drops straight into CI.

## Data policy (§28)

All inputs here are **synthetic** and contain **no real patient information**,
no real names, and no CNICs. Keep it that way.
