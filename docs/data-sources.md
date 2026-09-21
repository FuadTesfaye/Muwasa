# Data Sources — Muwāsā

## Primary Sources (MVP)

### 1. Tanzil.net — Canonical Quran Text

- **URL:** https://tanzil.net
- **What we get:** Verified Arabic Quran text (Uthmani, Simple, Simple Clean scripts)
- **Format:** XML, TXT, SQL
- **License:** CC BY 3.0
- **Critical rules:**
  - Text must NEVER be modified
  - Attribution to "Tanzil Project" required
  - Hyperlink to tanzil.net required
- **Used for:** `quran_verses.arabic_uthmani`, `quran_verses.arabic_simple`, `quran_verses.arabic_simple_clean`

### 2. QuranEnc — Translations & Tafsir

- **URL:** https://quranenc.com
- **API:** `https://quranenc.com/api/v1/`
- **What we get:** 100+ translations (60+ languages), footnotes, concise tafsir (Al-Muyassar, Al-Mukhtasar)
- **Format:** JSON API, also downloadable as SQLite/CSV/XML
- **License:** Free with conditions
- **Critical rules:**
  - No modification of translation text
  - Attribution to QuranEnc.com + original translator
  - Version number must be displayed
  - Must sync with latest corrections
- **API keys:** None required
- **Rate limits:** Be respectful (1 req/sec recommended)
- **Used for:** `quran_translations`, `quran_tafsirs`

### 3. HadeethEnc.com — Hadith with Grades & Explanations

- **URL:** https://hadeethenc.com
- **API:** `https://hadeethenc.com/api/v1/`
- **What we get:** Hadith text (Arabic + 70 languages), grades, scholarly explanations (sharh), lessons (fawa'id), word meanings
- **Format:** JSON API
- **License:** Waqf / charitable endowment (free for educational/digital use)
- **Critical rules:**
  - Attribution to HadeethEnc.com required
  - No modification or deletion of content
- **API keys:** None for basic usage
- **Why this over Sunnah.com:** Sunnah.com's English translations are copyrighted by Darussalam Publishers. HadeethEnc is waqf-licensed and includes explanations + lessons that Sunnah.com doesn't provide via API.
- **Used for:** `hadith_collections`, `hadiths`

### 4. Quranic Arabic Corpus — Morphology & Linguistics

- **URL:** https://corpus.quran.com
- **What we get:** 77,430 words with morphological analysis (root, lemma, POS, gender, number, case)
- **Format:** Pipe-delimited TXT
- **License:** GPL (academic, attribution required)
- **Used for:** `quran_word_morphology` (improves Arabic search)

## Secondary Sources (Phase 2+)

### HuggingFace Datasets

| Dataset | Use | License |
|---------|-----|---------|
| `ArabicNLPWorld/canonical-islamic-corpus` | Supplementary Quran + Hadith | CC BY-SA 4.0 |
| `quranlab/hadith` | Cross-reference hadith data | Multi-license |
| `MohamedRashad/Quran-Tafseer` | 84 tafsir books (219K rows) | Open/CC |
| `omaressam1111/multi-tafseer-quran-rag` | Pre-chunked RAG tafsir | Apache 2.0 |
| `tarteel-ai/quranqa` | Quran QA evaluation benchmark | CC BY-ND 4.0 |

### OpenITI

- 11,000+ classical Islamic texts, 2 billion words
- **License:** CC BY-NC-SA 4.0 (NON-COMMERCIAL)
- **Quality warning:** OCR artifacts and varying text quality. Use for research layer only.

## Source Hierarchy

```
Primary/official source         ← ALWAYS prefer
        ↓
Verified scholarly edition      ← Second choice
        ↓
Curated dataset                 ← Third choice
        ↓
HuggingFace/GitHub mirror       ← Last resort, verify first

NEVER the reverse.
```

## What We Do NOT Use

- Random websites
- Unattributed online collections
- Auto-translated content as authoritative
- AI-generated Islamic text as source material
- Scraped content without license verification
