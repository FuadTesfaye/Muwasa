-- 007_chat_system.sql

CREATE TABLE IF NOT EXISTS chat_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- References auth.users if authenticated
    anonymous_token VARCHAR(255),
    
    title VARCHAR(255),
    current_situation JSONB DEFAULT '{}'::jsonb,
    summary TEXT,
    settings JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_chat_sessions_modtime BEFORE UPDATE ON chat_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS chat_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL, -- 'user', 'assistant', 'system'
    content TEXT NOT NULL,
    
    situation_profile JSONB DEFAULT '{}'::jsonb,
    safety_result JSONB DEFAULT '{}'::jsonb,
    evidence_pack JSONB DEFAULT '[]'::jsonb,
    
    model_version VARCHAR(100),
    prompt_version VARCHAR(100),
    kb_version VARCHAR(100),
    
    token_count INTEGER,
    latency_ms INTEGER,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS response_sources (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
    
    source_type VARCHAR(50) NOT NULL, -- 'verse', 'hadith', 'story', 'dua'
    source_id UUID NOT NULL,
    
    citation_text TEXT,
    was_verified BOOLEAN DEFAULT true,
    retrieval_rank INTEGER,
    reranker_score FLOAT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- RLS
ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own chat sessions"
    ON chat_sessions FOR SELECT
    USING (auth.uid() = user_id OR anonymous_token = current_setting('request.jwt.claims', true)::json->>'anonymous_token');

CREATE POLICY "Users can create their own chat sessions"
    ON chat_sessions FOR INSERT
    WITH CHECK (auth.uid() = user_id OR anonymous_token = current_setting('request.jwt.claims', true)::json->>'anonymous_token');

CREATE POLICY "Users can update their own chat sessions"
    ON chat_sessions FOR UPDATE
    USING (auth.uid() = user_id OR anonymous_token = current_setting('request.jwt.claims', true)::json->>'anonymous_token');

CREATE POLICY "Users can delete their own chat sessions"
    ON chat_sessions FOR DELETE
    USING (auth.uid() = user_id OR anonymous_token = current_setting('request.jwt.claims', true)::json->>'anonymous_token');

CREATE POLICY "Users can view messages in their sessions"
    ON chat_messages FOR SELECT
    USING (session_id IN (SELECT id FROM chat_sessions WHERE auth.uid() = user_id OR anonymous_token = current_setting('request.jwt.claims', true)::json->>'anonymous_token'));

CREATE POLICY "Users can create messages in their sessions"
    ON chat_messages FOR INSERT
    WITH CHECK (session_id IN (SELECT id FROM chat_sessions WHERE auth.uid() = user_id OR anonymous_token = current_setting('request.jwt.claims', true)::json->>'anonymous_token'));

