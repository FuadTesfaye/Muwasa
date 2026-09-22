import { 
  pgTable, 
  text, 
  varchar, 
  timestamp, 
  uuid, 
  integer, 
  boolean, 
  jsonb, 
  index, 
  vector 
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ---------------------------------------------------------------------------
// 1. ISLAMIC SOURCE REGISTRY & KNOWLEDGE CHUNKS
// ---------------------------------------------------------------------------

export const sources = pgTable('sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  type: varchar('type', { length: 32 }).notNull(), // 'quran' | 'hadith' | 'tafsir' | 'story' | 'dua'
  name: text('name').notNull(),
  version: varchar('version', { length: 32 }).default('1.0'),
  license: text('license'),
  url: text('url'),
  publisher: text('publisher'),
  verified: boolean('verified').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const knowledgeChunks = pgTable(
  'knowledge_chunks',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    sourceId: uuid('source_id').references(() => sources.id, { onDelete: 'cascade' }),
    sourceType: varchar('source_type', { length: 32 }).notNull(), // 'quran' | 'hadith' | 'tafsir' | 'story' | 'dua'
    sourceReference: text('source_reference').notNull(), // '39:53' | 'Sahih Muslim #2999'
    title: text('title').notNull(),
    arabicText: text('arabic_text'),
    translation: text('translation'),
    content: text('content').notNull(),
    tags: text('tags').array(),
    metadata: jsonb('metadata').default({}), // grade, grader, collection, author, etc.
    status: varchar('status', { length: 32 }).default('approved').notNull(), // 'pending' | 'approved' | 'rejected'
    embedding: vector('embedding', { dimensions: 768 }),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    embeddingIdx: index('knowledge_embedding_idx').using('hnsw', table.embedding.op('vector_cosine_ops')),
    sourceRefIdx: index('knowledge_source_ref_idx').on(table.sourceReference),
    sourceTypeIdx: index('knowledge_source_type_idx').on(table.sourceType),
    statusIdx: index('knowledge_status_idx').on(table.status),
  })
);

// ---------------------------------------------------------------------------
// 2. SITUATION ONTOLOGY & EMOTIONS
// ---------------------------------------------------------------------------

export const emotions = pgTable('emotions', {
  slug: varchar('slug', { length: 64 }).primaryKey(),
  nameEn: text('name_en').notNull(),
  nameAr: text('name_ar'),
  category: varchar('category', { length: 32 }).default('negative'),
  description: text('description'),
});

export const situations = pgTable('situations', {
  slug: varchar('slug', { length: 64 }).primaryKey(),
  nameEn: text('name_en').notNull(),
  nameAr: text('name_ar'),
  category: varchar('category', { length: 32 }).notNull(), // 'loss' | 'relationships' | 'self' | 'worship' | 'worldly_pressure'
  description: text('description'),
});

export const spiritualStates = pgTable('spiritual_states', {
  slug: varchar('slug', { length: 64 }).primaryKey(),
  nameEn: text('name_en').notNull(),
  nameAr: text('name_ar'),
  description: text('description'),
});

export const situationAliases = pgTable('situation_aliases', {
  id: uuid('id').defaultRandom().primaryKey(),
  situationSlug: varchar('situation_slug', { length: 64 }).references(() => situations.slug),
  alias: text('alias').notNull(),
  language: varchar('language', { length: 8 }).default('en').notNull(),
});

// ---------------------------------------------------------------------------
// 3. USER PROFILES & AUTH CONVERSATIONS
// ---------------------------------------------------------------------------

export const userProfiles = pgTable('user_profiles', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull().unique(),
  displayName: text('display_name'),
  language: varchar('language', { length: 8 }).default('en'),
  translationPreference: text('translation_preference').default('Saheeh International'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id'), // Null for anonymous guest sessions
  title: text('title').default('New Reflection'),
  language: varchar('language', { length: 8 }).default('en'),
  status: varchar('status', { length: 32 }).default('active').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
    role: varchar('role', { length: 16 }).notNull(), // 'user' | 'assistant' | 'system'
    content: text('content').notNull(),
    sequence: integer('sequence').notNull(),
    situationProfile: jsonb('situation_profile'),
    safetyResult: jsonb('safety_result'),
    tokenCount: integer('token_count'),
    latencyMs: integer('latency_ms'),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => ({
    convoSeqIdx: index('messages_convo_seq_idx').on(table.conversationId, table.sequence),
  })
);

export const responseSources = pgTable('response_sources', {
  id: uuid('id').defaultRandom().primaryKey(),
  messageId: uuid('message_id').references(() => messages.id, { onDelete: 'cascade' }).notNull(),
  knowledgeChunkId: uuid('knowledge_chunk_id').references(() => knowledgeChunks.id),
  sourceReference: text('source_reference').notNull(),
  sourceType: varchar('source_type', { length: 32 }).notNull(),
  position: integer('position').notNull(),
  relevanceScore: text('relevance_score'),
  wasVerified: boolean('was_verified').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const conversationSummaries = pgTable('conversation_summaries', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').references(() => conversations.id, { onDelete: 'cascade' }).notNull(),
  summary: text('summary').notNull(),
  unresolvedQuestions: text('unresolved_questions').array(),
  lastMessageSequence: integer('last_message_sequence').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// 4. MEMORY, SAFETY AUDITING & FEEDBACK
// ---------------------------------------------------------------------------

export const memories = pgTable('memories', {
  id: uuid('id').defaultRandom().primaryKey(),
  userId: text('user_id').notNull(),
  type: varchar('type', { length: 32 }).notNull(), // 'preference' | 'reflection'
  key: text('key').notNull(),
  value: text('value').notNull(),
  confidence: text('confidence'),
  consent: boolean('consent').default(true).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }),
});

export const safetyEvents = pgTable('safety_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id'),
  messageId: uuid('message_id'),
  riskLevel: varchar('risk_level', { length: 32 }).notNull(), // 'none' | 'low' | 'moderate' | 'high' | 'critical'
  riskCategories: jsonb('risk_categories'),
  actionTaken: varchar('action_taken', { length: 64 }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const userFeedback = pgTable('user_feedback', {
  id: uuid('id').defaultRandom().primaryKey(),
  messageId: uuid('message_id'),
  responseHelpful: boolean('response_helpful').notNull(),
  responseTone: text('response_tone'),
  sourceRelevant: boolean('source_relevant'),
  comment: text('comment'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

// ---------------------------------------------------------------------------
// 5. BETTER AUTH TABLES
// ---------------------------------------------------------------------------

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').notNull(),
  image: text('image'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
});

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('account_id').notNull(),
  providerId: text('provider_id').notNull(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('access_token'),
  refreshToken: text('refresh_token'),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp('access_token_expires_at', { withTimezone: true }),
  refreshTokenExpiresAt: timestamp('refresh_token_expires_at', { withTimezone: true }),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull(),
});

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }),
  updatedAt: timestamp('updated_at', { withTimezone: true }),
});

