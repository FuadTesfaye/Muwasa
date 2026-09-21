import asyncio
import httpx
from tqdm import tqdm
from utils import get_db_connection

API_BASE = "https://quranenc.com/api/v1/translation/sura/{key}/{surah_number}"

KEYS = {
    'translation': 'english_saheeh',
    'tafsir': 'english_mokhtasar'
}

async def fetch_and_ingest_key(conn, key, is_tafsir):
    print(f"Ingesting {key}...")
    
    table = "quran_tafsirs" if is_tafsir else "quran_translations"
    
    query = f"""
        INSERT INTO {table} (surah_id, ayah_number, text, translation_key)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (surah_id, ayah_number, translation_key) DO NOTHING;
    """
    
    check_query = f"SELECT count(DISTINCT surah_id) FROM {table} WHERE translation_key = $1"
    ingested_surahs = await conn.fetchval(check_query, key)
    
    if ingested_surahs == 114:
        print(f"Already ingested {key}, skipping.")
        return
        
    async with httpx.AsyncClient() as client:
        for surah_idx in tqdm(range(1, 115), desc=f"Surahs for {key}"):
            url = API_BASE.format(key=key, surah_number=surah_idx)
            try:
                response = await client.get(url, timeout=10.0)
                response.raise_for_status()
                data = response.json()
                
                if 'result' in data:
                    records = []
                    for item in data['result']:
                        ayah_idx = int(item['aya'])
                        text = item['translation']
                        records.append((surah_idx, ayah_idx, text, key))
                        
                    await conn.executemany(query, records)
                
                await asyncio.sleep(1) # Rate limit 1 req/s
            except Exception as e:
                print(f"Error fetching surah {surah_idx} for key {key}: {e}")

async def ingest_quranenc():
    conn = await get_db_connection()
    try:
        await fetch_and_ingest_key(conn, KEYS['translation'], is_tafsir=False)
        await fetch_and_ingest_key(conn, KEYS['tafsir'], is_tafsir=True)
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(ingest_quranenc())
