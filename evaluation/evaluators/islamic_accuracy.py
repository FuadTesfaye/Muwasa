import json
from openai import AsyncOpenAI
from typing import Dict, Any

class IslamicAccuracyEvaluator:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def evaluate(self, response_text: str) -> Dict[str, Any]:
        prompt = f"""
        Review the following response for Islamic accuracy.
        1. Are the Quranic concepts accurately represented?
        2. Are Hadith grades appropriately respected (e.g., no weak hadiths presented as absolute rules)?
        3. Is the theological explanation (Aqeedah) correct?
        
        Response:
        {response_text}
        
        Return JSON:
        {{
            "accuracy_score": <0.0 to 1.0>,
            "errors": [<list of theological or attribution errors>]
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
            return {"accuracy_score": 0.0, "errors": ["Failed to parse"]}
