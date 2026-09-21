# Muwāsā — مُوَاسَاة

> *A quiet place to speak, reflect, and return to Allah.*

A private Islamic emotional-support companion that listens first, understands the situation, retrieves relevant Qur'an, Sunnah, stories and scholarly explanations, then helps the person think and act through the situation.

**100% Pure TypeScript. Source-bound. Citation-first. Privacy-first. Safety-aware.**

---

## What Makes This Different

Muwāsā doesn't tell you to "just have sabr." It listens first, understands what you're carrying, and then brings you the Qur'an, Sunnah, stories and guidance that actually speak to your situation — with sources you can verify.

## Architecture

```
User → Safety Gateway → Situation Understanding → Hybrid Islamic Retrieval
     → Reranking → LLM Response Generation → Citation Verification → Response
```

- **The LLM is NOT the source of Islam.** The curated knowledge base is the source. The LLM is the conversational reasoner.
- **Every religious claim has an evidence trail.** `response → response_sources → source_documents`
- **100% TypeScript + Bun.** Ultra-fast runtime, native WebSockets, zero Python runtime dependencies.

---

## Project Structure

| Component | Path | Language | Engine / Framework |
|-----------|------|----------|-------------------|
| **Web Frontend** | `web/` | TypeScript | Next.js 15 (App Router, React 19, Tailwind, shadcn) |
| **AI Server** | `server/` | TypeScript | Bun Native WebSockets + Hono (ultra-low latency) |
| **Islamic KB** | `islamic-kb/` | TypeScript | Tanzil & HadeethEnc ingestion pipelines |
| **Situation Ontology** | `situation-ontology/` | TypeScript | Emotion, situation & safety taxonomies |
| **Retrieval Engine** | `retrieval-engine/` | TypeScript | Hybrid search (pgvector + full-text) & RRF |
| **Evaluation Suite** | `evaluation/` | TypeScript | Safety, citation & situation test runner |
| **Database** | `db/` | SQL & TypeScript | Supabase / PostgreSQL migrations & runner |

---

## Data Sources & Attributions

| Source | Role | License |
|--------|------|---------|
| [Tanzil.net](https://tanzil.net) | Canonical Immutable Arabic Qur'an | CC BY 3.0 (Verbatim, Attribution) |
| [QuranEnc.com](https://quranenc.com) | Translations & Concise Tafsir | Free (Attribution, Version Tracking) |
| [HadeethEnc.com](https://hadeethenc.com) | Authenticated Hadith with Explanations | Waqf (Attribution Required) |
| [Quranic Arabic Corpus](https://corpus.quran.com) | Linguistic Roots & Morphology | GPL (Attribution) |

---

## Quick Start (with Bun)

```bash
# 1. Clone & enter repository
cd Muwasa

# 2. Setup dependencies (Root & Web)
bun run setup
# or: make setup

# 3. Configure environment
cp .env.example .env
# Fill in your Supabase DB URL and OpenAI API Key

# 4. Run database migrations on Supabase/PostgreSQL
bun run migrate

# 5. Ingest Islamic Knowledge Base
bun run ingest:all

# 6. Start Development Environment (Server + Web concurrently)
bun run dev:server    # Starts AI WebSocket server on http://localhost:8000
bun run dev:web       # Starts Next.js 15 on http://localhost:3000
```

---

## Running Tests & Evaluation

```bash
# Run unit tests (Bun native test runner)
bun test

# Run AI Safety & Citation evaluation suite
bun run eval
```

---

## License

This project's software code is licensed under the MIT License. The sacred Islamic texts and translations retain their respective waqf and open licenses with mandatory attribution.
