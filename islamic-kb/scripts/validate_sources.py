import asyncio
from utils import get_db_connection

async def validate_sources():
    conn = await get_db_connection()
    
    print("--- Islamic KB Validation Report ---")
    
    ayah_count = await conn.fetchval("SELECT count(*) FROM quran_verses")
    print(f"Total Ayahs: {ayah_count} (Expected: 6236)")
    
    dupes = await conn.fetchval("SELECT count(*) FROM (SELECT surah_id, ayah_number FROM quran_verses GROUP BY surah_id, ayah_number HAVING count(*) > 1) d")
    print(f"Duplicate Verses: {dupes}")
    
    hadith_count = await conn.fetchval("SELECT count(*) FROM hadiths")
    hadith_no_grade = await conn.fetchval("SELECT count(*) FROM hadiths WHERE grade IS NULL OR grade = ''")
    print(f"Total Hadiths: {hadith_count}")
    print(f"Hadiths missing grade: {hadith_no_grade}")
    
    verses_emb = await conn.fetchval("SELECT count(*) FROM quran_verses WHERE embedding IS NOT NULL")
    hadith_emb = await conn.fetchval("SELECT count(*) FROM hadiths WHERE embedding IS NOT NULL")
    
    if ayah_count > 0:
        print(f"Quran Embedding Coverage: {(verses_emb/ayah_count)*100:.2f}%")
    if hadith_count > 0:
        print(f"Hadith Embedding Coverage: {(hadith_emb/hadith_count)*100:.2f}%")
        
    await conn.close()

if __name__ == "__main__":
    asyncio.run(validate_sources())
