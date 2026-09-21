import re
from typing import List, Dict, Any

class CitationAccuracyEvaluator:
    def evaluate(self, response_text: str, valid_sources: List[Dict[str, Any]]) -> Dict[str, Any]:
        # Simple extraction of references like (Quran 2:286) or [Bukhari 1234]
        quran_pattern = r'Quran\s+(\d+:\d+)'
        hadith_pattern = r'(Bukhari|Muslim|Tirmidhi|Abu Dawud|Ibn Majah|Nasa\'i)\s+(\d+)'
        
        quran_citations = re.findall(quran_pattern, response_text, re.IGNORECASE)
        hadith_citations = re.findall(hadith_pattern, response_text, re.IGNORECASE)
        
        valid_quran_keys = [s.get('verse_key') for s in valid_sources if s.get('type') == 'quran_verses']
        
        errors = []
        for q in quran_citations:
            if q not in valid_quran_keys:
                errors.append(f"Invalid or unprovided Quran citation: {q}")
                
        # To do deep checking, we'd need the exact text match logic, 
        # but for this MVP evaluator we just check if it's in the valid_sources list
        
        score = 1.0
        if errors:
            score = max(0.0, 1.0 - (0.2 * len(errors)))
            
        return {
            "accuracy_score": score,
            "errors": errors
        }
