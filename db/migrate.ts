import postgres from "postgres";
import fs from "node:fs";
import path from "node:path";
import { config } from "dotenv";

// Load .env
config({ path: path.resolve(import.meta.dir, "../.env") });
config();

const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;

if (!dbUrl) {
  console.error("❌ Error: DATABASE_URL or SUPABASE_DB_URL environment variable is required.");
  console.error("Please configure it in your .env file.");
  process.exit(1);
}

const sql = postgres(dbUrl, {
  max: 1,
  ssl: dbUrl.includes("supabase.co") || dbUrl.includes("aws-") ? "require" : undefined,
});

async function runMigrations() {
  console.log("🕌 Muwāsā Database Migration Runner (TypeScript)");
  console.log("Connecting to PostgreSQL/Supabase...");

  try {
    // 1. Create migration tracking table
    await sql`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ DEFAULT NOW()
      );
    `;

    const migrationsDir = path.resolve(import.meta.dir, "migrations");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((f) => f.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const version = file.split("_")[0];

      // Check if applied
      const existing = await sql`
        SELECT version FROM schema_migrations WHERE version = ${version}
      `;

      if (existing.length > 0) {
        console.log(`⏩ Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`⚡ Applying ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const fileSql = fs.readFileSync(filePath, "utf-8");

      // Execute in transaction
      await sql.unsafe(fileSql);
      await sql`
        INSERT INTO schema_migrations (version) VALUES (${version})
      `;
      console.log(`✅ Applied ${file}`);
    }

    console.log("🎉 All migrations completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    await sql.end();
  }
}

runMigrations();
