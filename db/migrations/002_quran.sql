-- 002_quran.sql

CREATE TABLE IF NOT EXISTS quran_surahs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    surah_number INTEGER NOT NULL UNIQUE,
    name_arabic VARCHAR(255) NOT NULL,
    name_transliteration VARCHAR(255) NOT NULL,
    name_english VARCHAR(255) NOT NULL,
    revelation_type VARCHAR(50) NOT NULL, -- 'Meccan', 'Medinan'
    total_verses INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_quran_surahs_modtime BEFORE UPDATE ON quran_surahs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS quran_verses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    surah_id UUID NOT NULL REFERENCES quran_surahs(id) ON DELETE CASCADE,
    verse_number INTEGER NOT NULL,
    verse_key VARCHAR(50) NOT NULL UNIQUE, -- e.g., '1:1'
    juz_number INTEGER,
    hizb_number INTEGER,
    page_number INTEGER,
    
    arabic_uthmani TEXT NOT NULL,
    arabic_simple TEXT NOT NULL,
    arabic_simple_clean TEXT NOT NULL,
    
    embedding HALFVEC(1024),
    search_tsv TSVECTOR,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (surah_id, verse_number)
);
CREATE TRIGGER update_quran_verses_modtime BEFORE UPDATE ON quran_verses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update search_tsv for verses
CREATE OR REPLACE FUNCTION quran_verses_search_trigger() RETURNS trigger AS $$
begin
  new.search_tsv :=
    setweight(to_tsvector('arabic', coalesce(new.arabic_simple_clean,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.verse_key,'')), 'B');
  return new;
end
$$ LANGUAGE plpgsql;

CREATE TRIGGER quran_verses_search_update BEFORE INSERT OR UPDATE ON quran_verses FOR EACH ROW EXECUTE FUNCTION quran_verses_search_trigger();


CREATE TABLE IF NOT EXISTS quran_translations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse_id UUID NOT NULL REFERENCES quran_verses(id) ON DELETE CASCADE,
    registry_id UUID NOT NULL REFERENCES source_registry(id),
    language_code VARCHAR(10) NOT NULL,
    text TEXT NOT NULL,
    translator_name VARCHAR(255),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (verse_id, registry_id, language_code)
);
CREATE TRIGGER update_quran_translations_modtime BEFORE UPDATE ON quran_translations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS quran_tafsirs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse_id UUID NOT NULL REFERENCES quran_verses(id) ON DELETE CASCADE,
    registry_id UUID NOT NULL REFERENCES source_registry(id),
    language_code VARCHAR(10) NOT NULL,
    author_name VARCHAR(255),
    text TEXT NOT NULL,
    embedding HALFVEC(1024),
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TRIGGER update_quran_tafsirs_modtime BEFORE UPDATE ON quran_tafsirs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TABLE IF NOT EXISTS quran_word_morphology (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    verse_id UUID NOT NULL REFERENCES quran_verses(id) ON DELETE CASCADE,
    word_position INTEGER NOT NULL,
    word_arabic TEXT NOT NULL,
    word_translation TEXT,
    root_word TEXT,
    pos_tag VARCHAR(50), -- Part of speech
    grammar_info TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE (verse_id, word_position)
);
CREATE TRIGGER update_quran_word_morphology_modtime BEFORE UPDATE ON quran_word_morphology FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
