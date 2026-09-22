import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/muwasa';

// In serverless / edge environments or build steps, use a small pool
export const client = postgres(connectionString, {
  max: process.env.NODE_ENV === 'production' ? 10 : 3,
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: false, // Required for Neon connection pooling / pgbouncer
});

export const db = drizzle(client, { schema });
