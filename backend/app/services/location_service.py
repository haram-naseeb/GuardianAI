"""Mock Location / Hospital service (Section 8, 23).

Finds and ranks nearby hospitals. Swap for a Maps API behind the same
`LocationService` Protocol. Ranking balances distance with capability relevance
(e.g. a Trauma Center is boosted for a road accident, Cardiology for cardiac).
Transport is prioritised as ambulance for CRITICAL/HIGH (Section 8.1).
"""
from __future__ import annotations

from typing import Optional
from urllib.parse import quote_plus

from app.schemas.emergency import HospitalRecommendation, LocationInput
from app.schemas.enums import IncidentType, Priority
from app.services.mock_data import DEFAULT_LOCATION, HOSPITALS
from app.utils.ids import haversine_km

# Which capabilities matter for which incident type.
_RELEVANCE: dict[IncidentType, set[str]] = {
    IncidentType.ROAD_ACCIDENT: {"Trauma Center", "Surgery", "ICU"},
    IncidentType.FALL: {"Trauma Center", "Surgery"},
    IncidentType.BLEEDING: {"Trauma Center", "Surgery", "ICU"},
    IncidentType.CARDIAC: {"Cardiology", "ICU"},
    IncidentType.BREATHING: {"ICU", "Cardiology"},
    IncidentType.BURN: {"Burn Unit"},
    IncidentType.FIRE: {"Burn Unit", "ICU"},
}


class MockLocationService:
    name = "mock"

    def find_hospitals(self, location: Optional[LocationInput], *,
                       incident_type: IncidentType, priority: Priority,
                       limit: int = 3) -> list[HospitalRecommendation]:
        lat = location.lat if location and location.lat is not None else DEFAULT_LOCATION["lat"]
        lng = location.lng if location and location.lng is not None else DEFAULT_LOCATION["lng"]

        relevant = _RELEVANCE.get(incident_type, set())
        urgent = priority in (Priority.CRITICAL, Priority.HIGH)
        transport = "Ambulance (Rescue 1122)" if urgent else "Private vehicle / ride-hailing"

        ranked: list[tuple[float, HospitalRecommendation]] = []
        for h in HOSPITALS:
            distance = haversine_km(lat, lng, h["lat"], h["lng"])
            match_bonus = len(relevant.intersection(h["capabilities"]))
            # Lower is better: distance minus a relevance discount.
            rank_score = distance - (match_bonus * 1.5)
            eta = max(4, int(distance / 0.5))  # ~30 km/h urban avg -> 0.5 km/min
            dest = quote_plus(f"{h['name']}, {h['address']}")
            rec = HospitalRecommendation(
                id=h["id"], name=h["name"], address=h["address"],
                distance_km=distance, eta_minutes=eta, transport=transport,
                phone=h["phone"], capabilities=h["capabilities"],
                lat=h["lat"], lng=h["lng"], open_now=True,
                map_url=f"https://www.google.com/maps/dir/?api=1&destination={dest}",
            )
            ranked.append((rank_score, rec))

        ranked.sort(key=lambda x: x[0])
        return [rec for _, rec in ranked[:limit]]
