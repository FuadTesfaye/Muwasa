-- 006_tags_relationships.sql

CREATE TABLE IF NOT EXISTS verse_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse_id UUID NOT NULL REFERENCES quran_verses(id) ON DELETE CASCADE,
    tag_type VARCHAR(50) NOT NULL, -- 'concept', 'emotion', 'situation', 'spiritual_state'
    tag_slug VARCHAR(255) NOT NULL,
    relevance_score FLOAT DEFAULT 1.0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(verse_id, tag_type, tag_slug)
);

CREATE TABLE IF NOT EXISTS hadith_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    hadith_id UUID NOT NULL REFERENCES hadiths(id) ON DELETE CASCADE,
    tag_type VARCHAR(50) NOT NULL,
    tag_slug VARCHAR(255) NOT NULL,
    relevance_score FLOAT DEFAULT 1.0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(hadith_id, tag_type, tag_slug)
);

CREATE TABLE IF NOT EXISTS story_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
    tag_type VARCHAR(50) NOT NULL,
    tag_slug VARCHAR(255) NOT NULL,
    relevance_score FLOAT DEFAULT 1.0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(story_id, tag_type, tag_slug)
);

CREATE TABLE IF NOT EXISTS dua_tags (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    dua_id UUID NOT NULL REFERENCES duas(id) ON DELETE CASCADE,
    tag_type VARCHAR(50) NOT NULL,
    tag_slug VARCHAR(255) NOT NULL,
    relevance_score FLOAT DEFAULT 1.0,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(dua_id, tag_type, tag_slug)
);

CREATE TABLE IF NOT EXISTS source_relationships (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_a_type VARCHAR(50) NOT NULL, -- 'verse', 'hadith', 'story', 'dua'
    source_a_id UUID NOT NULL,
    source_b_type VARCHAR(50) NOT NULL,
    source_b_id UUID NOT NULL,
    relationship_type VARCHAR(50) NOT NULL, -- 'explains', 'related', 'similar', 'contrasts'
    description TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(source_a_type, source_a_id, source_b_type, source_b_id, relationship_type)
);
