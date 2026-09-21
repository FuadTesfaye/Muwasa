-- 010_seed_registry.sql

INSERT INTO source_registry (name, description, trust_level, url, license)
VALUES
    ('Tanzil', 'Tanzil Quran text and translations project', 'primary', 'https://tanzil.net', 'Creative Commons BY-ND 3.0'),
    ('QuranEnc', 'The Noble Quran Encyclopedia for translations', 'primary', 'https://quranenc.com', 'Free for non-commercial use'),
    ('HadeethEnc', 'The Hadith Encyclopedia', 'primary', 'https://hadeethenc.com', 'Free for non-commercial use'),
    ('Quranic Arabic Corpus', 'Morphological and Syntactic Treebank for the Quran', 'primary', 'https://corpus.quran.com', 'GNU Public License')
ON CONFLICT (name) DO NOTHING;
