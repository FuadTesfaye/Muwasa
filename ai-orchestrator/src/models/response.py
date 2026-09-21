from pydantic import BaseModel, Field
from typing import List, Optional, Any, Dict
from src.models.situation import SituationProfile
from src.models.safety import SafetyResult

class SourceCard(BaseModel):
    type: str # quran/hadith/tafsir/story/dua
    source_data: Dict[str, Any]
    citation: str
    verified: bool = True

class ChatMessage(BaseModel):
    id: str
    role: str
    content: str
    sources: List[SourceCard] = Field(default_factory=list)
    safety_result: Optional[SafetyResult] = None
    situation_profile: Optional[SituationProfile] = None

class ChatResponse(BaseModel):
    message: str
    sources: List[SourceCard] = Field(default_factory=list)
    follow_up_prompt: Optional[str] = None

class StreamChunk(BaseModel):
    type: str # text/source_card/done
    content: Any
