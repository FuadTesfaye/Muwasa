from pydantic import BaseModel, Field
from typing import List, Optional

class EmotionClassification(BaseModel):
    emotion_slug: str
    confidence: float

class SituationClassification(BaseModel):
    situation_slug: str
    confidence: float

class SituationProfile(BaseModel):
    primary_emotion: Optional[str] = None
    secondary_emotions: List[str] = Field(default_factory=list)
    situations: List[str] = Field(default_factory=list)
    spiritual_context: Optional[str] = None
    risk: str = "low"
