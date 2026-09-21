from openai import AsyncOpenAI
from typing import List, Dict
from src.config import settings

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def summarize_conversation(history: List[Dict[str, str]]) -> str:
    if not history:
        return ""
        
    system_prompt = """
    Summarize this conversation context. Extract:
    1. Key topics discussed
    2. Emotional arc of the user
    3. Important facts
    4. Current situation
    Keep it concise.
    """
    
    history_text = "\n".join([f"{msg['role']}: {msg['content']}" for msg in history])
    
    response = await client.chat.completions.create(
        model=settings.summarizer_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": history_text}
        ]
    )
    
    return response.choices[0].message.content or ""
