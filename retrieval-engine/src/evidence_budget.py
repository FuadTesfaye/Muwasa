from typing import Dict, Any

class EvidenceBudget:
    def __init__(self, quran: int, hadith: int, tafsir: int, story: int, dua: int):
        self.quran = quran
        self.hadith = hadith
        self.tafsir = tafsir
        self.story = story
        self.dua = dua

def assess_complexity(profile: Dict[str, Any]) -> str:
    if profile.get('risk_assessment') in ['high', 'critical']:
        return 'crisis'
    
    situations = profile.get('situations', [])
    spiritual = profile.get('spiritual_context', [])
    
    total_tags = len(situations) + len(spiritual)
    
    if total_tags > 3:
        return 'deep'
    elif total_tags > 1:
        return 'moderate'
    else:
        return 'simple'

def calculate_budget(profile: Dict[str, Any], is_follow_up: bool = False) -> EvidenceBudget:
    if is_follow_up:
        return EvidenceBudget(quran=1, hadith=0, tafsir=0, story=0, dua=0)
        
    complexity = assess_complexity(profile)
    
    if complexity == 'crisis':
        return EvidenceBudget(quran=1, hadith=0, tafsir=0, story=0, dua=1)
    elif complexity == 'deep':
        return EvidenceBudget(quran=3, hadith=2, tafsir=2, story=1, dua=1)
    elif complexity == 'moderate':
        return EvidenceBudget(quran=2, hadith=1, tafsir=1, story=1, dua=0)
    else: # simple
        return EvidenceBudget(quran=1, hadith=1, tafsir=0, story=0, dua=0)
