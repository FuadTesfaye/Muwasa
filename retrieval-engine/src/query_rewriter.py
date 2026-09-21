import json
from typing import List
from openai import AsyncOpenAI

class QueryRewriter:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def rewrite(self, user_message: str) -> List[str]:
        prompt = f"""
        You are an Islamic support retrieval assistant.
        A user has sent the following message: "{user_message}"
        
        Generate 2-4 diverse search queries to find relevant Quranic verses, Hadiths, and Duas.
        Focus on the underlying spiritual and emotional themes.
        Return the result as a JSON array of strings under the key "queries".
        """

        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            response_format={"type": "json_object"}
        )

        try:
            content = json.loads(response.choices[0].message.content)
            return content.get("queries", [user_message])
        except Exception:
            return [user_message]
