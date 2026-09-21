-- 009_indexes.sql

-- HNSW Vector Indexes
CREATE INDEX IF NOT EXISTS quran_verses_embedding_idx 
ON quran_verses USING hnsw (embedding halfvec_cosine_ops) 
WITH (m = 16, ef_construction = 128);

CREATE INDEX IF NOT EXISTS quran_tafsirs_embedding_idx 
ON quran_tafsirs USING hnsw (embedding halfvec_cosine_ops) 
WITH (m = 16, ef_construction = 128);

CREATE INDEX IF NOT EXISTS hadiths_embedding_idx 
ON hadiths USING hnsw (embedding halfvec_cosine_ops) 
WITH (m = 16, ef_construction = 128);

CREATE INDEX IF NOT EXISTS stories_embedding_idx 
ON stories USING hnsw (embedding halfvec_cosine_ops) 
WITH (m = 16, ef_construction = 128);

CREATE INDEX IF NOT EXISTS duas_embedding_idx 
ON duas USING hnsw (embedding halfvec_cosine_ops) 
WITH (m = 16, ef_construction = 128);


-- GIN Indexes for Full-Text Search
CREATE INDEX IF NOT EXISTS quran_verses_search_idx 
ON quran_verses USING GIN (search_tsv);

CREATE INDEX IF NOT EXISTS hadiths_search_idx 
ON hadiths USING GIN (search_tsv);


-- B-Tree Indexes for Foreign Keys and Lookups
CREATE INDEX IF NOT EXISTS quran_verses_surah_idx ON quran_verses(surah_id);
CREATE INDEX IF NOT EXISTS hadiths_collection_idx ON hadiths(collection_id);

CREATE INDEX IF NOT EXISTS chat_messages_session_idx ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS response_sources_message_idx ON response_sources(message_id);

-- Indexes for Tag lookups
CREATE INDEX IF NOT EXISTS verse_tags_tag_slug_idx ON verse_tags(tag_slug);
CREATE INDEX IF NOT EXISTS hadith_tags_tag_slug_idx ON hadith_tags(tag_slug);
CREATE INDEX IF NOT EXISTS story_tags_tag_slug_idx ON story_tags(tag_slug);
CREATE INDEX IF NOT EXISTS dua_tags_tag_slug_idx ON dua_tags(tag_slug);

-- B-Tree indexes for filtering Hadiths
CREATE INDEX IF NOT EXISTS hadiths_grade_idx ON hadiths(grade);
CREATE INDEX IF NOT EXISTS hadiths_source_tier_idx ON hadiths(source_tier);

-- Index for session anonymous tokens
CREATE INDEX IF NOT EXISTS chat_sessions_anon_token_idx ON chat_sessions(anonymous_token);
