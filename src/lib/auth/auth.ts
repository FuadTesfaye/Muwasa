import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { db } from '@/lib/db';

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: 'pg',
  }),
  secret: process.env.BETTER_AUTH_SECRET || 'development-secret-muwasa-monolith-key-32chars-min',
  baseURL: process.env.BETTER_AUTH_URL || 'http://localhost:3000',
});
