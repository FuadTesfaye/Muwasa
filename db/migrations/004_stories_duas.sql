-- 004_stories_duas.sql

CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    source_type VARCHAR(50) NOT NULL, -- 'primary_text', 'authentic_hadith', 'tafsir', 'scholarly_story', 'historical_report'
    primary_sources JSONB DEFAULT '[]'::jsonb, -- Array of objects referencing quran/hadith
    
    lessons JSONB DEFAULT '[]'::jsonb,
    review_status VARCHAR(50) DEFAULT 'pending',
    
    embedding HALFVEC(1024),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_stories_modtime BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();


CREATE TABLE IF NOT EXISTS duas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title_english VARCHAR(255) NOT NULL,
    arabic_text TEXT,
    transliteration TEXT,
    translation_english TEXT NOT NULL,
    
    source_reference TEXT, -- Where it comes from
    grade VARCHAR(50),
    occasion VARCHAR(255), -- When to say it
    
    virtues JSONB DEFAULT '[]'::jsonb,
    
    embedding HALFVEC(1024),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_duas_modtime BEFORE UPDATE ON duas FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
