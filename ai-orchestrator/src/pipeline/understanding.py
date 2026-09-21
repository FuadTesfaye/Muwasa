import json
from openai import AsyncOpenAI
from src.config import settings
from src.models.situation import SituationProfile
from typing import List, Dict, Any

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def understand_situation(
    message: str, 
    history: List[Dict[str, str]], 
    existing_profile: SituationProfile | None
) -> SituationProfile:
    system_prompt = """
    You are an empathy engine for an Islamic emotional support AI.
    Update the user's SituationProfile based on their latest message and conversation history.
    The profile evolves.
    
    Respond in JSON matching this schema:
    {
      "primary_emotion": "slug",
      "secondary_emotions": ["slug1", "slug2"],
      "situations": ["slug1", "slug2"],
      "spiritual_context": "string or null",
      "risk": "low" | "medium" | "high"
    }
    """
    
    context = ""
    if existing_profile:
        context += f"Existing Profile: {existing_profile.model_dump_json()}\n"
    
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history[-5:]])
    context += f"Recent History:\n{history_text}\n"
    context += f"Latest User Message: {message}\n"
    
    response = await client.chat.completions.create(
        model=settings.classifier_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": context}
        ],
        response_format={"type": "json_object"},
        temperature=0.1
    )
    
    try:
        content = json.loads(response.choices[0].message.content)
        return SituationProfile(**content)
    except Exception:
        return existing_profile or SituationProfile()
