-- 003_hadith.sql

CREATE TABLE IF NOT EXISTS hadith_collections (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    registry_id UUID NOT NULL REFERENCES source_registry(id),
    name_english VARCHAR(255) NOT NULL,
    name_arabic VARCHAR(255),
    slug VARCHAR(255) NOT NULL UNIQUE,
    total_hadiths INTEGER,
    has_chapters BOOLEAN DEFAULT true,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_hadith_collections_modtime BEFORE UPDATE ON hadith_collections FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS hadiths (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    collection_id UUID NOT NULL REFERENCES hadith_collections(id) ON DELETE CASCADE,
    hadith_number VARCHAR(50) NOT NULL,
    
    arabic_text TEXT,
    english_text TEXT NOT NULL,
    
    grade VARCHAR(255), -- e.g., 'Sahih', 'Hasan', 'Daif'
    grader VARCHAR(255),
    source_tier SMALLINT CHECK (source_tier BETWEEN 0 AND 6),
    
    chapter_number VARCHAR(50),
    chapter_english TEXT,
    chapter_arabic TEXT,
    
    explanation TEXT,
    lessons JSONB DEFAULT '[]'::jsonb,
    word_meanings JSONB DEFAULT '{}'::jsonb,
    
    review_status VARCHAR(50) DEFAULT 'pending',
    
    embedding HALFVEC(1024),
    search_tsv TSVECTOR,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (collection_id, hadith_number)
);
CREATE TRIGGER update_hadiths_modtime BEFORE UPDATE ON hadiths FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update search_tsv for hadiths
CREATE OR REPLACE FUNCTION hadiths_search_trigger() RETURNS trigger AS $$
begin
  new.search_tsv :=
    setweight(to_tsvector('english', coalesce(new.english_text,'')), 'A') ||
    setweight(to_tsvector('arabic', coalesce(new.arabic_text,'')), 'B');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER hadiths_search_update BEFORE INSERT OR UPDATE ON hadiths FOR EACH ROW EXECUTE FUNCTION hadiths_search_trigger();
