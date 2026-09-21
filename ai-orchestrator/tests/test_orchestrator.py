import os
import sys
import pytest
from fastapi.testclient import TestClient

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from src.main import app
from src.models.situation import SituationProfile
from src.models.evidence import QuranEvidence, HadithEvidence, EvidencePack
from src.models.safety import SafetyResult, SafetyAction
from src.models.response import SourceCard, StreamChunk
from src.pipeline.safety import get_crisis_response

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_situation_profile_model():
    profile = SituationProfile(
        primary_emotion="shame",
        secondary_emotions=["sadness", "frustration"],
        situations=["parent_pressure", "comparison"],
        spiritual_context=["qadr", "self_worth"],
        risk="none_detected"
    )
    assert profile.primary_emotion == "shame"
    data = profile.model_dump()
    assert "primary_emotion" in data
    assert len(profile.secondary_emotions) == 2

def test_evidence_pack_model():
    q = QuranEvidence(
        verse_key="39:53",
        arabic="قُلْ يَا عِبَادِيَ",
        translation="Say, O My servants",
        tafsir_excerpt="Exegesis on hope",
        source="Tanzil.net"
    )
    h = HadithEvidence(
        collection="Muslim",
        number="2721",
        arabic="...",
        english="Patience in hardship",
        grade="Sahih",
        grader="Muslim",
        explanation="Commentary",
        source="HadeethEnc.com"
    )
    pack = EvidencePack(quran=[q], hadith=[h], stories=[], duas=[])
    assert len(pack.quran) == 1
    assert pack.quran[0].verse_key == "39:53"
    assert len(pack.hadith) == 1

def test_safety_result_model():
    res = SafetyResult(
        is_safe=False,
        is_crisis=True,
        risk_category="suicidal_ideation",
        confidence=0.98,
        action=SafetyAction.CRISIS_RESPONSE
    )
    assert res.is_crisis is True
    assert res.action == SafetyAction.CRISIS_RESPONSE

def test_crisis_response_text():
    crisis_text = get_crisis_response()
    # Must NOT contain harmful/guilt language
    assert "bad muslim" in crisis_text.lower() # specifically says: "does not make you a bad Muslim"
    assert "precious" in crisis_text.lower()
    # Must contain hotlines
    assert "988" in crisis_text
    assert "741741" in crisis_text

def test_source_card_and_chunk_models():
    card = SourceCard(
        type="quran",
        citation="Qur'an 39:53",
        verified=True,
        data={"verse_key": "39:53", "translation": "Mercy"}
    )
    assert card.type == "quran"
    chunk = StreamChunk(type="source_card", content=card.model_dump())
    assert chunk.type == "source_card"
