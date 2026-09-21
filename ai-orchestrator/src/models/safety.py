from pydantic import BaseModel
from enum import Enum
from typing import Optional

class SafetyAction(str, Enum):
    NORMAL = "NORMAL"
    GENTLE_CHECK = "GENTLE_CHECK"
    SAFETY_REDIRECT = "SAFETY_REDIRECT"
    CRISIS_RESPONSE = "CRISIS_RESPONSE"

class SafetyResult(BaseModel):
    is_safe: bool
    is_crisis: bool
    risk_category: Optional[str] = None
    confidence: float
    action: SafetyAction
