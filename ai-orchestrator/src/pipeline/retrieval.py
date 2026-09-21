import json
from openai import AsyncOpenAI
from typing import List, Dict, Any
from src.config import settings
from src.models.situation import SituationProfile
from src.models.evidence import EvidenceBudget, EvidencePack, QuranEvidence, HadithEvidence

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def calculate_evidence_budget(profile: SituationProfile) -> EvidenceBudget:
    # Dummy logic for now, could be dynamic based on risk/complexity
    return EvidenceBudget(
        quran_count=2,
        hadith_count=2,
        tafsir_count=1,
        story_count=1 if profile.risk == "low" else 0,
        dua_count=1
    )

async def query_rewrite(message: str, profile: SituationProfile) -> List[str]:
    prompt = f"Rewrite this message into 3 search queries for an Islamic database. Message: {message}, Emotion: {profile.primary_emotion}"
    response = await client.chat.completions.create(
        model=settings.classifier_model,
        messages=[{"role": "user", "content": prompt}]
    )
    # Simplified splitting
    return [q.strip() for q in response.choices[0].message.content.split('\n') if q.strip()]

async def hybrid_search(queries: List[str], budget: EvidenceBudget) -> EvidencePack:
    # MOCK implementation. 
    # In reality, this would use db_pool to query pgvector (HNSW) and tsvector (BM25) with RRF k=60
    # It would filter by source_tier, grade (sahih/hasan), review_status.
    
    pack = EvidencePack()
    pack.quran.append(QuranEvidence(
        source="Quran",
        verse_key="94:5",
        arabic="فَإِنَّ مَعَ الْعُسْرِ يُسْرًا",
        translation="For indeed, with hardship [will be] ease.",
        tafsir_excerpt="Every hardship is accompanied by ease."
    ))
    pack.hadith.append(HadithEvidence(
        source="Sahih al-Bukhari",
        collection="bukhari",
        number="5641",
        arabic="مَا يُصِيبُ الْمُسْلِمَ مِنْ نَصَبٍ وَلاَ وَصَبٍ...",
        english="No fatigue, nor disease, nor sorrow, nor sadness, nor hurt, nor distress befalls a Muslim, even if it were the prick he receives from a thorn, but that Allah expiates some of his sins for that.",
        grade="Sahih"
    ))
    return pack

async def retrieve_evidence(message: str, profile: SituationProfile) -> EvidencePack:
    budget = await calculate_evidence_budget(profile)
    queries = await query_rewrite(message, profile)
    evidence = await hybrid_search(queries, budget)
    return evidence
