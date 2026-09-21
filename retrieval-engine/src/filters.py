from typing import List
try:
    from src.hybrid_search import SearchResult
except ImportError:
    try:
        from hybrid_search import SearchResult
    except ImportError:
        from .hybrid_search import SearchResult

def filter_by_tier(results: List[SearchResult], min_tier: int, max_tier: int) -> List[SearchResult]:
    filtered = []
    for r in results:
        tier = r.metadata.get('source_tier', 3)
        if min_tier <= tier <= max_tier:
            filtered.append(r)
    return filtered

def filter_by_grade(results: List[SearchResult], allowed_grades: List[str]) -> List[SearchResult]:
    filtered = []
    for r in results:
        if r.type != 'hadiths':
            filtered.append(r)
            continue
            
        grade = r.metadata.get('grade', '').lower()
        if any(allowed.lower() in grade for allowed in allowed_grades):
            filtered.append(r)
    return filtered

def filter_by_review_status(results: List[SearchResult], required_status: str) -> List[SearchResult]:
    return [r for r in results if r.metadata.get('review_status') == required_status]

def deduplicate(results: List[SearchResult]) -> List[SearchResult]:
    seen = set()
    unique = []
    for r in results:
        uid = f"{r.type}_{r.id}"
        if uid not in seen:
            seen.add(uid)
            unique.append(r)
    return unique
