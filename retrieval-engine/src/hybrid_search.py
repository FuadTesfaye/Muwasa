import asyncpg
import json
from typing import List, Dict, Any, Optional
from pydantic import BaseModel

class SearchResult(BaseModel):
    type: str
    id: str
    content: str
    score: float
    metadata: Dict[str, Any]

class HybridSearcher:
    def __init__(self, db_pool: asyncpg.Pool):
        self.db = db_pool

    async def vector_search(self, embedding: List[float], table: str, top_k: int = 10) -> List[Dict]:
        query = f"""
            SELECT id, content, metadata, 1 - (embedding <=> $1::vector) AS similarity
            FROM {table}
            ORDER BY embedding <=> $1::vector
            LIMIT $2
        """
        records = await self.db.fetch(query, embedding, top_k)
        return [dict(r) for r in records]

    async def bm25_search(self, text_query: str, table: str, top_k: int = 10) -> List[Dict]:
        query = f"""
            SELECT id, content, metadata,
                   ts_rank_cd(search_vector, plainto_tsquery('english', $1)) AS rank
            FROM {table}
            WHERE search_vector @@ plainto_tsquery('english', $1)
            ORDER BY rank DESC
            LIMIT $2
        """
        records = await self.db.fetch(query, text_query, top_k)
        return [dict(r) for r in records]

    async def tag_search(self, tags: List[str], table: str, top_k: int = 10) -> List[Dict]:
        query = f"""
            SELECT t.id, t.content, t.metadata, 1.0 AS score
            FROM {table} t
            WHERE t.tags && $1::text[]
            LIMIT $2
        """
        records = await self.db.fetch(query, tags, top_k)
        return [dict(r) for r in records]

    def _rrf(self, rankings_list: List[List[Dict]], k: int = 60) -> List[SearchResult]:
        scores = {}
        items = {}
        
        for rankings in rankings_list:
            for rank, item in enumerate(rankings):
                item_id = f"{item.get('type', 'doc')}_{item['id']}"
                if item_id not in scores:
                    scores[item_id] = 0.0
                    items[item_id] = item
                scores[item_id] += 1.0 / (k + rank + 1)
                
        sorted_items = sorted(scores.items(), key=lambda x: x[1], reverse=True)
        
        results = []
        for item_id, score in sorted_items:
            data = items[item_id]
            results.append(SearchResult(
                type=data.get('type', 'unknown'),
                id=str(data['id']),
                content=data['content'],
                score=score,
                metadata=json.loads(data['metadata']) if isinstance(data['metadata'], str) else data['metadata']
            ))
        return results

    async def hybrid_search(self, text_query: str, embedding: List[float], tags: List[str], tables: List[str] = ['quran_verses', 'hadiths', 'stories', 'duas', 'quran_tafsirs'], top_k: int = 10) -> List[SearchResult]:
        all_vector_results = []
        all_bm25_results = []
        all_tag_results = []

        for table in tables:
            v_res = await self.vector_search(embedding, table, top_k)
            for r in v_res: r['type'] = table
            all_vector_results.extend(v_res)

            b_res = await self.bm25_search(text_query, table, top_k)
            for r in b_res: r['type'] = table
            all_bm25_results.extend(b_res)

            if tags:
                t_res = await self.tag_search(tags, table, top_k)
                for r in t_res: r['type'] = table
                all_tag_results.extend(t_res)

        # Sort to create formal rankings per retrieval method before RRF
        all_vector_results.sort(key=lambda x: x['similarity'], reverse=True)
        all_bm25_results.sort(key=lambda x: x['rank'], reverse=True)
        
        return self._rrf([all_vector_results, all_bm25_results, all_tag_results])[:top_k]
