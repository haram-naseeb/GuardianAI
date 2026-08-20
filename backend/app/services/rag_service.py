"""Mock RAG / knowledge-retrieval service (Section 26).

Grounds guidance in trusted sources. Swap for FAISS + embeddings behind the same
`RAGService` Protocol; the retrieval interface (query -> ranked KnowledgeSource[])
stays identical, so agents and the safety layer are unaffected.
"""
from __future__ import annotations

from typing import Optional

from app.schemas.emergency import KnowledgeSource
from app.schemas.enums import IncidentType
from app.services.mock_data import KNOWLEDGE_BASE


class MockRAGService:
    name = "mock"

    def retrieve(self, query: str, *, top_k: int = 4,
                 incident_type: Optional[IncidentType] = None) -> list[KnowledgeSource]:
        q = (query or "").lower()
        incident = incident_type.value if incident_type else None

        scored: list[tuple[float, dict]] = []
        for doc in KNOWLEDGE_BASE:
            score = 0.0
            if incident and incident in doc["tags"]:
                score += 2.0
            # Lexical overlap between query and title/snippet (bag-of-words).
            text = f"{doc['title']} {doc['snippet']}".lower()
            score += sum(0.2 for token in set(q.split()) if len(token) > 3 and token in text)
            # "Scene safety" is broadly relevant — small baseline.
            if doc["id"] == "scene-safety":
                score += 0.5
            if score > 0:
                scored.append((score, doc))

        scored.sort(key=lambda x: x[0], reverse=True)
        results: list[KnowledgeSource] = []
        for score, doc in scored[:top_k]:
            results.append(KnowledgeSource(
                id=doc["id"], title=doc["title"], source=doc["source"],
                snippet=doc["snippet"], url=doc.get("url"), score=round(score, 2),
            ))
        return results
