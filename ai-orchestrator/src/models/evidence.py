from pydantic import BaseModel, Field
from typing import List, Optional

class BaseEvidence(BaseModel):
    source: str

class QuranEvidence(BaseEvidence):
    verse_key: str
    arabic: str
    translation: str
    tafsir_excerpt: Optional[str] = None

class HadithEvidence(BaseEvidence):
    collection: str
    number: str
    arabic: str
    english: str
    grade: str
    grader: Optional[str] = None
    explanation: Optional[str] = None

class StoryEvidence(BaseEvidence):
    title: str
    content: str
    moral: Optional[str] = None

class DuaEvidence(BaseEvidence):
    arabic: str
    transliteration: str
    translation: str
    context: Optional[str] = None

class EvidencePack(BaseModel):
    quran: List[QuranEvidence] = Field(default_factory=list)
    hadith: List[HadithEvidence] = Field(default_factory=list)
    stories: List[StoryEvidence] = Field(default_factory=list)
    duas: List[DuaEvidence] = Field(default_factory=list)

class EvidenceBudget(BaseModel):
    quran_count: int = 2
    hadith_count: int = 2
    tafsir_count: int = 1
    story_count: int = 1
    dua_count: int = 1
    priority: List[str] = Field(default_factory=lambda: ["quran", "hadith", "dua"])
