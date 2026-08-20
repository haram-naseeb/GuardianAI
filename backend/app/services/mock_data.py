"""Realistic demo data for the mock services (Section 23).

All data here is illustrative and clearly labelled as mock. Hospital entries use
public, well-known Lahore facilities with approximate coordinates for a
Pakistan-relevant demo; knowledge snippets are generic, cautiously-worded
first-aid guidance attributed to trusted authorities. No real patient data.
"""
from __future__ import annotations

from app.schemas.enums import IncidentType

# --- Scenario profiles: drive both the mock Vision service and mock triage so
# --- the demo behaves consistently end-to-end. -----------------------------
SCENARIO_PROFILES: dict[str, dict] = {
    "road_accident": {
        "incident_type": IncidentType.ROAD_ACCIDENT,
        "keywords": ["accident", "crash", "bike", "car", "motorcycle", "collision",
                     "road", "hit", "vehicle", "takkar", "haadsa"],
        "vision": [("Vehicle collision", 0.92), ("Visible bleeding", 0.83),
                   ("Person lying down", 0.79)],
        "observed": ["Road accident detected", "Visible bleeding", "Person lying on the road"],
    },
    "cardiac": {
        "incident_type": IncidentType.CARDIAC,
        "keywords": ["chest pain", "chest", "heart", "cardiac", "left arm", "sweating",
                     "seenay", "dil"],
        "vision": [("Person clutching chest", 0.7)],
        "observed": ["Reported chest pain", "Reported breathing difficulty"],
    },
    "breathing": {
        "incident_type": IncidentType.BREATHING,
        "keywords": ["breathing", "breathe", "choking", "asthma", "suffocat", "saans"],
        "vision": [("Person in distress", 0.68)],
        "observed": ["Reported breathing difficulty"],
    },
    "bleeding": {
        "incident_type": IncidentType.BLEEDING,
        "keywords": ["bleeding", "blood", "cut deep", "hemorrhage", "khoon"],
        "vision": [("Visible bleeding", 0.88)],
        "observed": ["Visible bleeding"],
    },
    "fall": {
        "incident_type": IncidentType.FALL,
        "keywords": ["fell", "fall", "slipped", "fracture", "broken", "gir gaya"],
        "vision": [("Person lying down", 0.8)],
        "observed": ["Person appears to have fallen"],
    },
    "burn": {
        "incident_type": IncidentType.BURN,
        "keywords": ["burn", "scald", "boiling", "jal gaya"],
        "vision": [("Burn injury", 0.78)],
        "observed": ["Burn injury reported"],
    },
    "fire": {
        "incident_type": IncidentType.FIRE,
        "keywords": ["fire", "smoke", "flames", "aag"],
        "vision": [("Fire", 0.9), ("Smoke", 0.85)],
        "observed": ["Fire / smoke detected"],
    },
    "minor_cut": {
        "incident_type": IncidentType.MINOR_INJURY,
        "keywords": ["minor cut", "small cut", "scratch", "graze", "chhoti"],
        "vision": [("Minor wound", 0.72)],
        "observed": ["Minor visible wound"],
    },
}

# --- Trusted knowledge snippets (illustrative). Real RAG replaces this with
# --- FAISS retrieval over ingested emergency-care documents. ----------------
KNOWLEDGE_BASE: list[dict] = [
    {
        "id": "who-bec-bleeding",
        "title": "Controlling severe external bleeding",
        "source": "WHO Basic Emergency Care",
        "snippet": "Apply firm, direct pressure to the wound with a clean cloth and "
                   "maintain it. Do not remove soaked dressings; add more on top.",
        "url": "https://www.who.int/publications/i/item/basic-emergency-care",
        "tags": ["ROAD_ACCIDENT", "BLEEDING"],
    },
    {
        "id": "redcross-unconscious",
        "title": "Care for an unresponsive person who is breathing",
        "source": "IFRC / Red Cross First Aid Guidelines",
        "snippet": "If unresponsive but breathing normally, place in the recovery "
                   "position and monitor breathing until help arrives.",
        "url": "https://www.ifrc.org/first-aid",
        "tags": ["ROAD_ACCIDENT", "FALL", "MEDICAL_EMERGENCY"],
    },
    {
        "id": "aha-chestpain",
        "title": "Recognising a suspected heart attack",
        "source": "American Heart Association",
        "snippet": "Chest discomfort with shortness of breath, cold sweat, or arm/jaw "
                   "pain may indicate a cardiac emergency. Seek emergency care immediately.",
        "url": "https://www.heart.org",
        "tags": ["CARDIAC", "BREATHING"],
    },
    {
        "id": "who-airway",
        "title": "Opening the airway and checking breathing",
        "source": "WHO Basic Emergency Care",
        "snippet": "Check whether the person is breathing. If breathing is absent or "
                   "abnormal, alert emergency services and begin resuscitation if trained.",
        "url": "https://www.who.int/publications/i/item/basic-emergency-care",
        "tags": ["CARDIAC", "BREATHING", "ROAD_ACCIDENT"],
    },
    {
        "id": "redcross-burns",
        "title": "First aid for burns",
        "source": "IFRC / Red Cross First Aid Guidelines",
        "snippet": "Cool the burn with running water for at least 20 minutes. Do not "
                   "apply ice, butter, or ointments. Cover loosely with a clean dressing.",
        "url": "https://www.ifrc.org/first-aid",
        "tags": ["BURN", "FIRE"],
    },
    {
        "id": "who-minor-wounds",
        "title": "Cleaning and dressing minor wounds",
        "source": "WHO First Aid Guidance",
        "snippet": "Clean minor wounds with clean water, apply a sterile dressing, and "
                   "watch for signs of infection over the following days.",
        "url": "https://www.who.int",
        "tags": ["MINOR_INJURY", "BLEEDING"],
    },
    {
        "id": "scene-safety",
        "title": "Ensuring scene safety before helping",
        "source": "WHO Basic Emergency Care",
        "snippet": "Before approaching, make sure the scene is safe for you and the "
                   "patient — watch for traffic, fire, electricity, or other hazards.",
        "url": "https://www.who.int/publications/i/item/basic-emergency-care",
        "tags": ["ROAD_ACCIDENT", "FIRE", "FALL", "MEDICAL_EMERGENCY"],
    },
]

# --- Hospitals (public Lahore facilities; approximate coordinates). ---------
HOSPITALS: list[dict] = [
    {
        "id": "mayo-lhr", "name": "Mayo Hospital", "address": "Anarkali, Lahore",
        "lat": 31.5731, "lng": 74.3095, "phone": "1122",
        "capabilities": ["Trauma Center", "Emergency", "ICU", "Surgery"],
    },
    {
        "id": "jinnah-lhr", "name": "Jinnah Hospital", "address": "Faisal Town, Lahore",
        "lat": 31.4835, "lng": 74.2983, "phone": "1122",
        "capabilities": ["Trauma Center", "Emergency", "ICU", "Cardiology"],
    },
    {
        "id": "services-lhr", "name": "Services Hospital", "address": "Jail Road, Lahore",
        "lat": 31.5497, "lng": 74.3327, "phone": "1122",
        "capabilities": ["Emergency", "ICU", "Burn Unit", "Surgery"],
    },
    {
        "id": "national-lhr", "name": "National Hospital", "address": "DHA Phase 1, Lahore",
        "lat": 31.4697, "lng": 74.4028, "phone": "042-111-171-819",
        "capabilities": ["Emergency", "Cardiology", "ICU"],
    },
    {
        "id": "ganga-lhr", "name": "Ganga Ram Hospital", "address": "Queens Road, Lahore",
        "lat": 31.5644, "lng": 74.3163, "phone": "1122",
        "capabilities": ["Emergency", "Surgery", "Maternity"],
    },
]

# Default location if the user provides none (central Lahore).
DEFAULT_LOCATION = {"label": "Lahore, Pakistan", "lat": 31.5204, "lng": 74.3587}
