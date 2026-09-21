import { z } from "zod";
import path from "node:path";
import { config } from "dotenv";

config({ path: path.resolve(import.meta.dir, "../../.env") });
config();

const envSchema = z.object({
  SUPABASE_DB_URL: z.string().optional(),
  DATABASE_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().default("sk-placeholder-key"),
  LLM_MODEL: z.string().default("gpt-4o"),
  SAFETY_MODEL: z.string().default("gpt-4o-mini"),
  CLASSIFIER_MODEL: z.string().default("gpt-4o-mini"),
  PORT: z.coerce.number().default(8000),
  HOST: z.string().default("0.0.0.0"),
  KB_VERSION: z.string().default("1.0.0"),
});

const parsed = envSchema.parse(process.env);

export const serverConfig = {
  dbUrl: parsed.DATABASE_URL || parsed.SUPABASE_DB_URL || "postgresql://muwasa:dev_password@localhost:5432/muwasa",
  openaiApiKey: parsed.OPENAI_API_KEY,
  llmModel: parsed.LLM_MODEL,
  safetyModel: parsed.SAFETY_MODEL,
  classifierModel: parsed.CLASSIFIER_MODEL,
  port: parsed.PORT,
  host: parsed.HOST,
  kbVersion: parsed.KB_VERSION,
};
