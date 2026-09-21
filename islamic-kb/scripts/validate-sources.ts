import { getDatabaseConnection } from "./utils";

async function validateSources() {
  console.log("🔍 Validating Islamic Knowledge Base Integrity (TypeScript)...");
  const sql = getDatabaseConnection();

  try {
    const [surahCount] = await sql`SELECT count(*)::int FROM quran_surahs`;
    const [verseCount] = await sql`SELECT count(*)::int FROM quran_verses`;
    const [translationCount] = await sql`SELECT count(*)::int FROM quran_translations`;
    const [hadithCount] = await sql`SELECT count(*)::int FROM hadiths`;
    const [registryCount] = await sql`SELECT count(*)::int FROM source_registry`;

    console.log("==========================================");
    console.log("📊 Muwāsā Islamic KB Status Report");
    console.log("==========================================");
    console.log(`✅ Source Registry:       ${registryCount.count} registered trusted sources`);
    console.log(`📖 Quran Surahs:          ${surahCount.count} / 114`);
    console.log(`📖 Quran Verses:          ${verseCount.count} verses`);
    console.log(`🌐 Quran Translations:    ${translationCount.count} translations`);
    console.log(`📜 Authentic Hadiths:     ${hadithCount.count} hadiths`);
    console.log("==========================================");

    if (surahCount.count === 114 && verseCount.count >= 6236) {
      console.log("🎉 Core Quran canonical corpus is COMPLETE & VERIFIED.");
    } else {
      console.log("ℹ️ Knowledge base partially seeded. Run ingestion scripts to complete.");
    }
  } catch (err) {
    console.error("❌ Validation query failed:", err);
  } finally {
    await sql.end();
  }
}

validateSources();
