import postgres from "postgres";
import { serverConfig } from "./config";

let sqlInstance: postgres.Sql | null = null;

export function getDb(): postgres.Sql {
  if (!sqlInstance) {
    sqlInstance = postgres(serverConfig.dbUrl, {
      max: 10,
      ssl: serverConfig.dbUrl.includes("supabase.co") || serverConfig.dbUrl.includes("aws-") ? "require" : undefined,
      onnotice: () => {}, // silent notices
    });
  }
  return sqlInstance;
}

export async function checkDbConnection(): Promise<boolean> {
  try {
    const sql = getDb();
    await sql`SELECT 1`;
    return true;
  } catch {
    return false;
  }
}
