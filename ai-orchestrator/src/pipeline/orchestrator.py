import uuid
from typing import AsyncGenerator, List, Dict
import json
from src.db.redis import redis_client
from src.models.situation import SituationProfile
from src.models.response import StreamChunk
from src.pipeline.safety import check_safety, get_crisis_response, SafetyAction
from src.pipeline.understanding import understand_situation
from src.pipeline.retrieval import retrieve_evidence
from src.pipeline.generation import generate_response
from src.pipeline.citation import verify_citations

async def process_message(session_id: str, user_message: str) -> AsyncGenerator[StreamChunk, None]:
    r = redis_client.get_client()
    
    # 1. Load History & Profile
    history_str = await r.get(f"session:{session_id}:history")
    history = json.loads(history_str) if history_str else []
    
    profile_str = await r.get(f"session:{session_id}:profile")
    profile = SituationProfile.model_validate_json(profile_str) if profile_str else None

    # 2. Safety Check
    safety = await check_safety(user_message)
    if safety.action == SafetyAction.CRISIS_RESPONSE:
        yield StreamChunk(type="text", content=get_crisis_response())
        yield StreamChunk(type="done", content="")
        return

    # 3. Understand Situation
    new_profile = await understand_situation(user_message, history, profile)
    await r.set(f"session:{session_id}:profile", new_profile.model_dump_json(), ex=86400)

    # 4. Retrieval
    evidence = await retrieve_evidence(user_message, new_profile)

    # 5. Generation
    full_response = ""
    async for chunk in generate_response(user_message, history, new_profile, evidence):
        if chunk.type == "text":
            full_response += chunk.content
        yield chunk

    # 6. Citation Check (Post-generation verification)
    verification = await verify_citations(full_response, evidence)
    if not verification.get("all_verified", True):
        # In a real system, you might flag this or log it
        print("Warning: Unverified claims found:", verification.get("unverified_claims"))

    # Update History
    history.append({"role": "user", "content": user_message})
    history.append({"role": "assistant", "content": full_response})
    
    # Keep history manageable
    if len(history) > 20:
        history = history[-10:]
        
    await r.set(f"session:{session_id}:history", json.dumps(history), ex=86400)
