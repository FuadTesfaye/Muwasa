import asyncio
import httpx
from lxml import etree
from tqdm.asyncio import tqdm
from utils import get_db_connection

URL_UTHMANI = "https://tanzil.net/pub/download/download.php?quranType=uthmani&outType=xml&agree=true"
URL_SIMPLE_CLEAN = "https://tanzil.net/pub/download/download.php?quranType=simple-clean&outType=xml&agree=true"

async def download_xml(url):
    async with httpx.AsyncClient() as client:
        response = await client.get(url, timeout=30.0)
        response.raise_for_status()
        return response.content

async def ingest_tanzil():
    print("Downloading Tanzil XMLs...")
    uthmani_xml = await download_xml(URL_UTHMANI)
    simple_clean_xml = await download_xml(URL_SIMPLE_CLEAN)
    
    print("Parsing XMLs...")
    uthmani_root = etree.fromstring(uthmani_xml)
    simple_clean_root = etree.fromstring(simple_clean_xml)
    
    conn = await get_db_connection()
    
    try:
        await conn.execute("BEGIN;")
        
        surah_query = """
            INSERT INTO quran_surahs (id, name_arabic, verses_count)
            VALUES ($1, $2, $3)
            ON CONFLICT (id) DO NOTHING;
        """
        verse_query = """
            INSERT INTO quran_verses (surah_id, ayah_number, text_uthmani, text_simple_clean, search_vector, attribution)
            VALUES ($1, $2, $3, $4, to_tsvector('arabic', $4), 'Tanzil Project — tanzil.net')
            ON CONFLICT (surah_id, ayah_number) DO NOTHING;
        """
        
        simple_text_map = {}
        for sura in simple_clean_root.findall('sura'):
            s_idx = int(sura.get('index'))
            simple_text_map[s_idx] = {}
            for aya in sura.findall('aya'):
                a_idx = int(aya.get('index'))
                simple_text_map[s_idx][a_idx] = aya.get('text')
        
        surahs = uthmani_root.findall('sura')
        for sura in tqdm(surahs, desc="Ingesting Surahs & Ayahs"):
            sura_idx = int(sura.get('index'))
            sura_name = sura.get('name')
            ayas = sura.findall('aya')
            
            await conn.execute(surah_query, sura_idx, sura_name, len(ayas))
            
            verse_data = []
            for aya in ayas:
                aya_idx = int(aya.get('index'))
                text_uthmani = aya.get('text')
                text_simple = simple_text_map.get(sura_idx, {}).get(aya_idx, text_uthmani)
                verse_data.append((sura_idx, aya_idx, text_uthmani, text_simple))
            
            await conn.executemany(verse_query, verse_data)
            
        await conn.execute("COMMIT;")
        print("Successfully ingested Tanzil XMLs.")
        
    except Exception as e:
        await conn.execute("ROLLBACK;")
        print(f"Error during ingestion: {e}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(ingest_tanzil())
