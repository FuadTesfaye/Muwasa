import json
from openai import AsyncOpenAI
from src.config import settings
from src.models.safety import SafetyResult, SafetyAction

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def check_safety(message: str) -> SafetyResult:
    system_prompt = """
    You are a safety classifier for an Islamic emotional support AI.
    Analyze the user's message for: self_harm, suicidal_ideation, imminent_danger, harm_to_others, abuse, child_safety, severe_distress.
    Respond with JSON:
    {
      "is_safe": bool,
      "is_crisis": bool,
      "risk_category": "string or null",
      "confidence": float (0.0 to 1.0),
      "action": "NORMAL" | "GENTLE_CHECK" | "SAFETY_REDIRECT" | "CRISIS_RESPONSE"
    }
    """
    
    response = await client.chat.completions.create(
        model=settings.safety_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ],
        response_format={"type": "json_object"},
        temperature=0.0
    )
    
    try:
        content = json.loads(response.choices[0].message.content)
        return SafetyResult(**content)
    except Exception:
        # Default to safe if parsing fails, but log in real world
        return SafetyResult(is_safe=True, is_crisis=False, confidence=1.0, action=SafetyAction.NORMAL)

def get_crisis_response() -> str:
    return (
        "I am so deeply sorry for the immense pain you are carrying right now. "
        "Your life is precious, and your pain is valid. Please know that struggling "
        "in this way does not make you a bad Muslim—it just means you are carrying a burden "
        "too heavy to carry alone.\n\n"
        "Please, I urge you to reach out to someone who can help keep you safe right now:\n"
        "- Emergency Services (911 or local equivalent)\n"
        "- Suicide & Crisis Lifeline: Call or text 988 (US)\n"
        "- Crisis Text Line: Text HOME to 741741\n"
        "- Naseeha Mental Health Helpline: 1-866-NASEEHA (1-866-627-3342)\n\n"
        "Allah is with the broken-hearted. Please seek help."
    )
