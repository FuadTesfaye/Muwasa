import json
from typing import List, Dict, Any
from openai import AsyncOpenAI

class HallucinationDetector:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def evaluate(self, response_text: str, evidence_pack: List[Dict[str, Any]]) -> Dict[str, Any]:
        evidence_str = json.dumps(evidence_pack, indent=2)
        
        prompt = f"""
        You are a strict fact-checker.
        Given the following AI response and the provided evidence pack, determine if the response 
        invents or fabricates any Islamic sources (Quran verses, Hadiths, Duas, or stories) 
        that are NOT present in the evidence pack.
        
        Evidence Pack:
        {evidence_str}
        
        Response:
        {response_text}
        
        Return a JSON object:
        {{
            "hallucination_score": <float from 0.0 to 1.0, where 1.0 means full hallucination>,
            "hallucinated_claims": [<list of strings detailing the fake sources/claims>]
        }}
        """

        res = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        try:
            return json.loads(res.choices[0].message.content)
        except Exception:
            return {"hallucination_score": 1.0, "hallucinated_claims": ["Failed to parse response"]}
