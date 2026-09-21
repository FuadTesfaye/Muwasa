import json
from typing import List
from openai import AsyncOpenAI
try:
    from src.hybrid_search import SearchResult
except ImportError:
    try:
        from hybrid_search import SearchResult
    except ImportError:
        from .hybrid_search import SearchResult

class Reranker:
    def __init__(self, api_key: str):
        self.client = AsyncOpenAI(api_key=api_key)

    async def rerank(self, query: str, results: List[SearchResult], top_k: int = 5) -> List[SearchResult]:
        if not results:
            return []

        prompt = f"Given the user query: '{query}', evaluate the relevance of the following documents. " \
                 f"Score each document from 0.0 to 1.0 based on how well it addresses the emotional and spiritual needs of the query.\n\n"
        
        for idx, res in enumerate(results):
            prompt += f"Document {idx}:\nType: {res.type}\nContent: {res.content[:500]}...\n\n"
            
        prompt += "Return ONLY a JSON array of objects with 'index' and 'score'."

        response = await self.client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are an expert Islamic document relevance scorer."},
                {"role": "user", "content": prompt}
            ],
            response_format={"type": "json_object"}
        )

        try:
            content = json.loads(response.choices[0].message.content)
            scores = content.get("scores", [])
            if not scores:
                # Fallback to structure if key is different
                scores = list(content.values())[0] if content else []
                
            for item in scores:
                idx = item.get("index")
                if 0 <= idx < len(results):
                    results[idx].score = float(item.get("score", 0.0))
        except Exception as e:
            print(f"Reranking parsing failed: {e}")
            
        results.sort(key=lambda x: x.score, reverse=True)
        return results[:top_k]
