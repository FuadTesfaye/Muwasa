-- 008_safety_feedback_observability.sql

CREATE TABLE IF NOT EXISTS safety_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE SET NULL,
    message_id UUID REFERENCES chat_messages(id) ON DELETE SET NULL,
    
    event_type VARCHAR(100) NOT NULL, -- e.g., 'pii_detected', 'harmful_content', 'fiqh_question_blocked'
    severity VARCHAR(50) NOT NULL, -- 'low', 'medium', 'high', 'critical'
    description TEXT,
    raw_event JSONB,
    
    handled_by VARCHAR(100),
    resolved BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_feedback (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    
    response_helpful BOOLEAN,
    response_tone VARCHAR(50), -- 'too_harsh', 'perfect', 'too_casual', etc.
    source_relevant BOOLEAN,
    comment TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS retrieval_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID REFERENCES chat_sessions(id) ON DELETE CASCADE,
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    
    query_text TEXT NOT NULL,
    query_embedding HALFVEC(1024),
    
    results JSONB NOT NULL,
    retrieval_time_ms INTEGER,
    rerank_time_ms INTEGER,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS model_evaluations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID REFERENCES chat_messages(id) ON DELETE CASCADE,
    
    evaluator_id UUID, -- Reference to admin user doing the eval
    score_accuracy INTEGER CHECK (score_accuracy BETWEEN 1 AND 5),
    score_tone INTEGER CHECK (score_tone BETWEEN 1 AND 5),
    score_safety INTEGER CHECK (score_safety BETWEEN 1 AND 5),
    score_islamic_correctness INTEGER CHECK (score_islamic_correctness BETWEEN 1 AND 5),
    
    comments TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
