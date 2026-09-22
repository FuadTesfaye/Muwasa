import postgres from 'postgres';
import fs from 'fs';
import path from 'path';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/muwasa';

async function runMigration() {
  console.log('🚀 Running database migrations...');
  const sql = postgres(connectionString, { max: 1 });

  try {
    // 1. Enable required PostgreSQL extensions
    console.log('📦 Enabling extensions: uuid-ossp, vector, pg_trgm...');
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`;
    await sql`CREATE EXTENSION IF NOT EXISTS vector;`;
    await sql`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;

    // 2. Read migration file
    const migrationPath = path.join(process.cwd(), 'drizzle/0000_perpetual_whizzer.sql');
    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found at ${migrationPath}`);
    }

    const migrationSql = fs.readFileSync(migrationPath, 'utf8');
    const statements = migrationSql.split('--> statement-breakpoint');

    for (const stmt of statements) {
      const trimmed = stmt.trim();
      if (trimmed) {
        await sql.unsafe(trimmed);
      }
    }

    console.log('✅ Migrations executed successfully!');
  } catch (error: any) {
    console.warn('⚠️ Migration note:', error.message);
  } finally {
    await sql.end();
  }
}

runMigration().catch((err) => {
  console.error('Migration failed:', err);
});
