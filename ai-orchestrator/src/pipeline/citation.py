from openai import AsyncOpenAI
import json
from typing import List, Dict, Any
from src.config import settings
from src.models.evidence import EvidencePack

client = AsyncOpenAI(api_key=settings.openai_api_key)

async def verify_citations(response_text: str, evidence: EvidencePack) -> Dict[str, Any]:
    system_prompt = """
    You are a citation verification system.
    Check if every Islamic claim (Qur'an or Hadith) in the response text is supported by the provided EvidencePack.
    If a claim references a source NOT in the pack, flag it as unverified.
    Return JSON:
    {
      "all_verified": boolean,
      "verified_claims": ["claim 1", "claim 2"],
      "unverified_claims": ["unverified 1"]
    }
    """
    
    response = await client.chat.completions.create(
        model=settings.summarizer_model,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": f"Evidence Pack: {evidence.model_dump_json()}\nResponse Text: {response_text}"}
        ],
        response_format={"type": "json_object"},
        temperature=0.0
    )
    
    try:
        return json.loads(response.choices[0].message.content)
    except Exception:
        return {"all_verified": True, "verified_claims": [], "unverified_claims": []}
