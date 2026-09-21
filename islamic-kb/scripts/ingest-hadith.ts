import { getDatabaseConnection, normalizeArabic } from "./utils";

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function ingestHadith() {
  console.log("📥 Ingesting Authentic Hadith from HadeethEnc.com (TypeScript)...");
  const sql = getDatabaseConnection();

  try {
    const [hadeethencSource] = await sql`
      SELECT id FROM source_registry WHERE name = 'HadeethEnc'
    `;
    const sourceId = hadeethencSource?.id;

    // 1. Fetch categories
    console.log("Fetching thematic categories...");
    const catRes = await fetch("https://hadeethenc.com/api/v1/categories/list/?language=en");
    if (!catRes.ok) {
      throw new Error(`Failed to fetch categories: HTTP ${catRes.status}`);
    }
    const categories = (await catRes.json()) as Array<{ id: string; title: string }>;

    // Key thematic categories relevant for emotional support:
    // Virtues & Manners, Heart Softeners (Ar-Riqaaq), Sincerity, Repentance, Supplications, Trials
    const relevantCatIds = categories.slice(0, 15).map((c) => c.id);

    // Map default collections
    const collections = [
      { slug: "bukhari", nameEn: "Sahih al-Bukhari", nameAr: "صحيح البخاري", compiler: "Imam al-Bukhari" },
      { slug: "muslim", nameEn: "Sahih Muslim", nameAr: "صحيح مسلم", compiler: "Imam Muslim" },
      { slug: "tirmidhi", nameEn: "Jami' at-Tirmidhi", nameAr: "جامع الترمذي", compiler: "Imam at-Tirmidhi" },
      { slug: "abu_dawud", nameEn: "Sunan Abi Dawud", nameAr: "سنن أبي داود", compiler: "Imam Abu Dawud" },
      { slug: "riyad_salihin", nameEn: "Riyad as-Salihin", nameAr: "رياض الصالحين", compiler: "Imam an-Nawawi" },
    ];

    const collectionMap = new Map<string, string>();
    for (const c of collections) {
      const [record] = await sql`
        INSERT INTO hadith_collections (slug, name_english, name_arabic, compiler, source_id)
        VALUES (${c.slug}, ${c.nameEn}, ${c.nameAr}, ${c.compiler}, ${sourceId})
        ON CONFLICT (slug) DO UPDATE SET name_english = EXCLUDED.name_english
        RETURNING id;
      `;
      collectionMap.set(c.slug, record.id);
    }

    let totalIngested = 0;

    for (const catId of relevantCatIds) {
      console.log(`Fetching hadiths for Category ID: ${catId}...`);
      const listUrl = `https://hadeethenc.com/api/v1/hadeeths/list/?language=en&category_id=${catId}&per_page=40`;
      const listRes = await fetch(listUrl);
      if (!listRes.ok) continue;

      const listJson = (await listRes.json()) as {
        data: Array<{ id: string; title: string }>;
      };

      for (const item of listJson.data) {
        // Fetch detailed hadith
        const detailUrl = `https://hadeethenc.com/api/v1/hadeeths/one/?id=${item.id}&language=en`;
        const detailRes = await fetch(detailUrl);
        if (!detailRes.ok) continue;

        const hadith = (await detailRes.json()) as {
          id: string;
          title: string;
          hadeeth: string;
          attribution: string;
          grade: string;
          explanation: string;
          hints: string[];
          words_meanings?: Array<{ word: string; meaning: string }>;
          reference: string;
        };

        const attrLower = (hadith.attribution || "").toLowerCase();
        let collectionSlug = "riyad_salihin";
        let sourceTier = 2;

        if (attrLower.includes("bukhari") && attrLower.includes("muslim")) {
          collectionSlug = "bukhari";
          sourceTier = 1; // Muttafaq alayh
        } else if (attrLower.includes("bukhari")) {
          collectionSlug = "bukhari";
          sourceTier = 2;
        } else if (attrLower.includes("muslim")) {
          collectionSlug = "muslim";
          sourceTier = 2;
        } else if (attrLower.includes("tirmidhi")) {
          collectionSlug = "tirmidhi";
          sourceTier = 2;
        } else if (attrLower.includes("abu dawud")) {
          collectionSlug = "abu_dawud";
          sourceTier = 2;
        }

        const colId = collectionMap.get(collectionSlug) || collectionMap.get("riyad_salihin")!;

        await sql`
          INSERT INTO hadiths (
            collection_id, hadith_number, arabic_matn, english_text,
            grade, grader, source_tier, explanation, lessons,
            word_meanings, source_id, source_url, review_status
          ) VALUES (
            ${colId}, ${hadith.id}, ${hadith.hadeeth}, ${hadith.title},
            ${hadith.grade || "Sahih"}, 'HadeethEnc Scholars', ${sourceTier},
            ${hadith.explanation}, ${JSON.stringify(hadith.hints || [])},
            ${JSON.stringify(hadith.words_meanings || [])}, ${sourceId},
            ${detailUrl}, 'approved'
          )
          ON CONFLICT (collection_id, hadith_number) DO UPDATE SET
            arabic_matn = EXCLUDED.arabic_matn,
            english_text = EXCLUDED.english_text,
            grade = EXCLUDED.grade,
            explanation = EXCLUDED.explanation,
            lessons = EXCLUDED.lessons;
        `;

        totalIngested++;
        await sleep(150);
      }
    }

    console.log(`🎉 Ingested ${totalIngested} authenticated hadiths from HadeethEnc.com!`);
  } catch (err) {
    console.error("❌ Hadith ingestion failed:", err);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

ingestHadith();
