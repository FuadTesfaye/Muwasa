import json
from openai import AsyncOpenAI
from typing import Dict, Any

class ToneEvaluator:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def evaluate(self, response_text: str, user_message: str) -> Dict[str, Any]:
        prompt = f"""
        Evaluate the tone of the following response from an Islamic emotional support bot.
        
        User Message: "{user_message}"
        Bot Response: "{response_text}"
        
        Score the following dimensions from 1 to 5:
        1. Compassion (5 = highly empathetic, 1 = cold)
        2. Preachiness (5 = highly preachy/lecturing, 1 = conversational and gentle)
        3. Judgment (5 = highly judgmental/condemning, 1 = non-judgmental)
        
        Return a JSON object:
        {{
            "compassion": 5,
            "preachiness": 1,
            "judgment": 1,
            "is_appropriate": true
        }}
        """

        res = await self.client.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        try:
            return json.loads(res.choices[0].message.content)
        except Exception:
            return {"error": "failed to parse tone evaluation"}
