#!/usr/bin/env python3
"""Guardian AI evaluation runner (spec §29).

Posts each case in `scenarios/` and `safety-tests/` to a running backend and
checks the response against the case's `expect` block. Property-based (asserts
priority ranges, escalation, grounding, disclaimer, cautious language) rather
than exact-text, so guidance wording can evolve without breaking the suite.

Usage:
    python evaluation/run_evals.py [--base http://localhost:8000]

Requires only the Python standard library. All inputs are synthetic (§28).
"""
from __future__ import annotations

import argparse
import glob
import json
import os
import sys
import urllib.error
import urllib.request

CAUTIOUS_LIKELIHOODS = {"POSSIBLE", "SUSPECTED", "UNLIKELY"}
HERE = os.path.dirname(os.path.abspath(__file__))


def post(base: str, payload: dict) -> dict:
    data = json.dumps(payload).encode("utf-8")
    req = urllib.request.Request(
        f"{base}/api/v1/emergency/analyze",
        data=data,
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read().decode("utf-8"))


def check(resp: dict, expect: dict) -> list[str]:
    """Return a list of failure messages (empty == passed)."""
    fails: list[str] = []

    def fail(msg: str) -> None:
        fails.append(msg)

    if "priority_in" in expect and resp.get("priority") not in expect["priority_in"]:
        fail(f"priority {resp.get('priority')!r} not in {expect['priority_in']}")

    if "incident_type" in expect and resp.get("incident_type") != expect["incident_type"]:
        fail(f"incident_type {resp.get('incident_type')!r} != {expect['incident_type']!r}")

    if "incident_type_in" in expect and resp.get("incident_type") not in expect["incident_type_in"]:
        fail(f"incident_type {resp.get('incident_type')!r} not in {expect['incident_type_in']}")

    if "language" in expect and resp.get("language") != expect["language"]:
        fail(f"language {resp.get('language')!r} != {expect['language']!r}")

    if "contact_emergency_services" in expect:
        got = bool((resp.get("safety") or {}).get("contact_emergency_services"))
        if got != expect["contact_emergency_services"]:
            fail(f"contact_emergency_services {got} != {expect['contact_emergency_services']}")

    if "min_immediate_actions" in expect:
        n = len(resp.get("immediate_actions") or [])
        if n < expect["min_immediate_actions"]:
            fail(f"immediate_actions {n} < {expect['min_immediate_actions']}")

    if expect.get("sources_nonempty") and not (resp.get("sources") or []):
        fail("sources empty")

    if expect.get("disclaimer_present") and not (resp.get("disclaimer") or "").strip():
        fail("disclaimer missing/empty")

    if expect.get("mock_labeled") and not (resp.get("meta") or {}).get("mock"):
        fail("meta.mock not truthy")

    if expect.get("possible_conditions_use_cautious_likelihood"):
        for c in resp.get("possible_conditions") or []:
            lk = c.get("likelihood")
            if lk not in CAUTIOUS_LIKELIHOODS:
                fail(f"non-cautious likelihood {lk!r}")

    for banned in expect.get("likelihood_never", []):
        for c in resp.get("possible_conditions") or []:
            if c.get("likelihood") == banned:
                fail(f"banned likelihood {banned!r} present")

    return fails


def run_file(base: str, path: str) -> tuple[int, int]:
    with open(path, encoding="utf-8") as fh:
        suite = json.load(fh)
    print(f"\n=== {os.path.relpath(path, HERE)} ===")
    passed = failed = 0
    for case in suite.get("cases", []):
        cid = case.get("id", "?")
        try:
            resp = post(base, case["input"])
        except urllib.error.URLError as exc:
            print(f"  ERROR {cid}: cannot reach backend ({exc})")
            failed += 1
            continue
        fails = check(resp, case.get("expect", {}))
        if fails:
            failed += 1
            print(f"  FAIL  {cid}")
            for f in fails:
                print(f"          - {f}")
        else:
            passed += 1
            print(f"  PASS  {cid}")
    return passed, failed


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base", default="http://localhost:8000")
    args = ap.parse_args()

    files = sorted(
        glob.glob(os.path.join(HERE, "scenarios", "*.json"))
        + glob.glob(os.path.join(HERE, "safety-tests", "*.json"))
    )
    if not files:
        print("No eval files found.")
        return 1

    total_p = total_f = 0
    for path in files:
        p, f = run_file(args.base, path)
        total_p += p
        total_f += f

    print(f"\n{'-' * 40}\nTOTAL: {total_p} passed, {total_f} failed")
    return 0 if total_f == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
