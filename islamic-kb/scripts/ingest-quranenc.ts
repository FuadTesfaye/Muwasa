import { getDatabaseConnection } from "./utils";

const TRANSLATION_KEY = "english_saheeh";
const TRANSLATOR_NAME = "Saheeh International";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ingestQuranEnc() {
  console.log("📥 Ingesting English Translations from QuranEnc.com (TypeScript)...");
  const sql = getDatabaseConnection();

  try {
    const [quranencSource] = await sql`
      SELECT id FROM source_registry WHERE name = 'QuranEnc'
    `;
    const sourceId = quranencSource?.id;

    for (let surah = 1; surah <= 114; surah++) {
      console.log(`Fetching Surah ${surah}/114 from QuranEnc...`);
      const url = `https://quranenc.com/api/v1/translation/sura/${TRANSLATION_KEY}/${surah}`;
      
      const res = await fetch(url);
      if (!res.ok) {
        console.warn(`Failed to fetch Surah ${surah}: HTTP ${res.status}`);
        await sleep(1000);
        continue;
      }

      const json = (await res.json()) as {
        result: Array<{
          sura: string;
          aya: string;
          translation: string;
          footnotes: string;
        }>;
      };

      for (const item of json.result) {
        const surahNum = parseInt(item.sura, 10);
        const ayahNum = parseInt(item.aya, 10);
        const verseKey = `${surahNum}:${ayahNum}`;

        const [verse] = await sql`
          SELECT id FROM quran_verses WHERE verse_key = ${verseKey}
        `;

        if (!verse) continue;

        await sql`
          INSERT INTO quran_translations (
            verse_id, language_code, translator, translation_text, footnotes, source_id, source_key
          ) VALUES (
            ${verse.id}, 'en', ${TRANSLATOR_NAME}, ${item.translation}, ${item.footnotes || null}, ${sourceId}, ${TRANSLATION_KEY}
          )
          ON CONFLICT (verse_id, language_code, translator) DO UPDATE SET
            translation_text = EXCLUDED.translation_text,
            footnotes = EXCLUDED.footnotes;
        `;
      }

      // Respectful rate-limiting
      await sleep(300);
    }

    console.log("🎉 Completed QuranEnc translations ingestion! Attribution: QuranEnc.com");
  } catch (err) {
    console.error("❌ QuranEnc ingestion error:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

ingestQuranEnc();
