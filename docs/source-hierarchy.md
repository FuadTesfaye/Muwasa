# Source Hierarchy — Muwāsā

Every piece of Islamic content in Muwāsā has a source tier and evidence trail.

## Tier System

| Tier | Type | Usage | Example |
|------|------|-------|---------|
| **0** | **Qur'an** | Direct quotation only. Arabic text is IMMUTABLE. Only approved translations. | `Qur'an 39:53` |
| **1** | **Muttafaq Alayh** | Direct quotation. Highest hadith authority (agreed upon by Bukhari AND Muslim). | `Muttafaq Alayh — Bukhari 6469, Muslim 2816` |
| **2** | **Sahih Collections** | Direct quotation. Authenticated narrations. Grade always displayed. | `Sahih Muslim 2999 — Grade: Sahih` |
| **3** | **Scholarly Explanations** | Explanation / context. Always attributed to the scholar/work. | `Tafsir al-Sa'di on 39:53` |
| **4** | **Seerah & Historical** | Stories / context. Source type clearly shown. | `From the Seerah — Story of Ayyub عليه السلام` |
| **5** | **Weak / Disputed** | ⛔ **EXCLUDED from MVP.** Da'if narrations not served to users. | — |
| **6** | **Unverified Popular** | ⛔ **EXCLUDED from MVP.** Popular quotes without verification. | — |

## Rules

1. **Never flatten tiers together.** A hadith and a popular quote are not the same thing.
2. **Always show the tier/source type** in the response UI.
3. **Never auto-upgrade** a source tier (e.g., treating a weak hadith as strong).
4. **When in doubt, don't cite.** "I could not verify that narration" is always acceptable.

## Source Classification

Content is also classified by **type**, which is orthogonal to tier:

| Type | Description |
|------|-------------|
| `primary_text` | Qur'an, Mutawatir hadith |
| `authentic_hadith` | Sahih/Hasan graded narrations |
| `tafsir` | Scholarly exegesis |
| `scholarly_story` | Stories with scholarly backing |
| `historical_report` | Historical material with attestation |
| `popular_story` | ⛔ Excluded from MVP |

## The AI May Not

- Rewrite Qur'an
- Invent Qur'an
- Generate "Qur'an-like" sentences
- Paraphrase revelation and put it in quotation marks
- Cite a source that wasn't retrieved from the knowledge base
