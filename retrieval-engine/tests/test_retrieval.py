import os
import sys
import pytest

sys.path.insert(0, os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "src"))
from evidence_budget import calculate_budget, assess_complexity, EvidenceBudget
from filters import filter_by_tier, filter_by_grade, deduplicate
from hybrid_search import SearchResult

def test_evidence_budget_simple():
    profile = {"situations": ["failure"], "spiritual_context": []}
    budget = calculate_budget(profile)
    assert budget.quran == 1
    assert budget.hadith == 1
    assert budget.tafsir == 0

def test_evidence_budget_deep():
    profile = {
        "situations": ["parent_pressure", "academic_failure", "comparison"],
        "spiritual_context": ["qadr", "self_worth"]
    }
    budget = calculate_budget(profile)
    assert budget.quran == 3
    assert budget.hadith == 2
    assert budget.tafsir == 2

def test_evidence_budget_crisis():
    profile = {
        "situations": ["severe_hopelessness"],
        "risk_assessment": "critical"
    }
    budget = calculate_budget(profile)
    assert budget.quran == 1
    assert budget.hadith == 0
    assert budget.dua == 1

def test_evidence_budget_follow_up():
    profile = {"situations": ["failure"]}
    budget = calculate_budget(profile, is_follow_up=True)
    assert budget.quran == 1
    assert budget.hadith == 0

def test_filter_by_tier():
    r1 = SearchResult(type="quran_verses", id="1", content="quran", score=0.9, metadata={"source_tier": 0})
    r2 = SearchResult(type="hadiths", id="2", content="hadith", score=0.8, metadata={"source_tier": 2})
    r3 = SearchResult(type="hadiths", id="3", content="weak hadith", score=0.5, metadata={"source_tier": 5})
    
    filtered = filter_by_tier([r1, r2, r3], min_tier=0, max_tier=2)
    assert len(filtered) == 2
    assert r3 not in filtered

def test_filter_by_grade():
    r1 = SearchResult(type="hadiths", id="1", content="sahih hadith", score=0.9, metadata={"grade": "Sahih"})
    r2 = SearchResult(type="hadiths", id="2", content="daif hadith", score=0.4, metadata={"grade": "Da'if"})
    r3 = SearchResult(type="quran_verses", id="3", content="verse", score=0.95, metadata={})
    
    filtered = filter_by_grade([r1, r2, r3], allowed_grades=["sahih", "hasan"])
    assert len(filtered) == 2  # Sahih hadith + non-hadith quran verse
    assert r2 not in filtered

def test_deduplicate():
    r1 = SearchResult(type="quran_verses", id="1", content="verse 1", score=0.9, metadata={})
    r2 = SearchResult(type="quran_verses", id="1", content="verse 1 dup", score=0.85, metadata={})
    r3 = SearchResult(type="quran_verses", id="2", content="verse 2", score=0.8, metadata={})
    
    unique = deduplicate([r1, r2, r3])
    assert len(unique) == 2
