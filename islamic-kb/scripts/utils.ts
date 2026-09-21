import postgres from "postgres";
import path from "node:path";
import { config } from "dotenv";

// Load environment variables
config({ path: path.resolve(import.meta.dir, "../../.env") });
config();

export function getDatabaseConnection() {
  const dbUrl = process.env.DATABASE_URL || process.env.SUPABASE_DB_URL;
  if (!dbUrl) {
    throw new Error("DATABASE_URL or SUPABASE_DB_URL must be defined in environment");
  }

  return postgres(dbUrl, {
    max: 10,
    ssl: dbUrl.includes("supabase.co") || dbUrl.includes("aws-") ? "require" : undefined,
  });
}

/**
 * Normalizes Arabic text for semantic matching and indexing:
 * - Removes harakat (tashkeel \u064B-\u065F)
 * - Removes tatweel / kashida (\u0640)
 * - Normalizes hamza variants (إ, أ, آ, ء -> ا)
 * - Normalizes ta marbuta (ة -> ه)
 * - Normalizes alif maqsura (ى -> ي)
 */
export function normalizeArabic(text: string | null | undefined): string {
  if (!text) return "";

  return text
    .replace(/[\u064B-\u065F]/g, "") // remove tashkeel
    .replace(/\u0640/g, "")           // remove tatweel
    .replace(/[إأآء]/g, "ا")          // normalize hamza
    .replace(/ة/g, "ه")               // ta marbuta -> ha
    .replace(/ى/g, "ي")               // alif maqsura -> ya
    .trim();
}
