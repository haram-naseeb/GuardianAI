"""Mock Vision service (Section 23).

Understands the incident image. Swap for Qwen-VL / Gemini Vision behind the same
`VisionService` Protocol. The mock keys off `image.scenario_hint` (set by the UI
demo picker) or the filename, and models the important failure case of an
unusable/blurry image so downstream safety logic can be exercised.
"""
from __future__ import annotations

from typing import Optional

from app.schemas.emergency import Detection, ImageMeta, VisionResult
from app.services.mock_data import SCENARIO_PROFILES


class MockVisionService:
    name = "mock"

    def analyze(self, image: Optional[ImageMeta]) -> VisionResult:
        if image is None:
            return VisionResult(analyzed=False, usable=True, detections=[],
                                notes="No image provided.")

        hint = (image.scenario_hint or "").lower()
        filename = (image.filename or "").lower()

        # Failure case: unusable image (Section 29 — test safe behaviour).
        if hint == "blurry" or "blur" in filename:
            return VisionResult(
                analyzed=True, usable=False, detections=[],
                notes="Image appears too blurry/unclear to analyze reliably. "
                      "Relying on the text description instead.",
            )

        profile = SCENARIO_PROFILES.get(hint)
        if profile is None:
            # Try to infer from filename keywords.
            for sid, prof in SCENARIO_PROFILES.items():
                if any(kw in filename for kw in prof["keywords"]):
                    profile = prof
                    break

        if profile is None:
            return VisionResult(
                analyzed=True, usable=True,
                detections=[Detection(label="Person present", confidence=0.55)],
                notes="Image analyzed; no strong emergency indicators detected visually.",
            )

        detections = [Detection(label=lbl, confidence=conf) for lbl, conf in profile["vision"]]
        return VisionResult(
            analyzed=True, usable=True, detections=detections,
            notes="Image analyzed by the Vision agent (mock).",
        )
