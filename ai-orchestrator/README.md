# Muwāsā AI Orchestrator

The AI Orchestrator is the conversational reasoning and routing brain of Muwāsā.

## Pipeline Architecture
1. **Safety Gateway**: Identifies crisis or harm intent immediately.
2. **Situation Understanding**: Tracks evolving emotional and situational profiles.
3. **Evidence Budget**: Calculates required scriptural evidence breadth.
4. **Query Rewriting**: Formulates optimized retrieval queries.
5. **Hybrid Retrieval**: Queries PostgreSQL (pgvector + full-text search) and ontology tags.
6. **Reranker**: Selects top-k most precise Quran, Hadith, and Tafsir sources.
7. **Main Reasoning LLM**: Generates cited, compassionate response.
8. **Citation Verifier**: Validates every religious claim against retrieved evidence.
9. **Safety Check**: Final filter before delivering message to user.
