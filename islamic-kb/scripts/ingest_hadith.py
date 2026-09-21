import asyncio
import httpx
from tqdm import tqdm
from utils import get_db_connection

BASE_URL = "https://hadeethenc.com/api/v1"

async def fetch_categories(client):
    url = f"{BASE_URL}/categories/list/?language=en"
    response = await client.get(url)
    response.raise_for_status()
    return response.json()

async def fetch_hadith_list(client, category_id, page):
    url = f"{BASE_URL}/hadeeths/list/?language=en&category_id={category_id}&per_page=100&page={page}"
    response = await client.get(url)
    response.raise_for_status()
    return response.json()

async def fetch_hadith_details(client, hadith_id):
    url = f"{BASE_URL}/hadeeths/one/?id={hadith_id}&language=en"
    try:
        response = await client.get(url, timeout=10.0)
        response.raise_for_status()
        return response.json()
    except Exception as e:
        print(f"Error fetching hadith {hadith_id}: {e}")
        return None

def determine_tier(attribution):
    attr = str(attribution).lower()
    if 'bukhari' in attr and 'muslim' in attr:
        return 1
    elif 'bukhari' in attr or 'muslim' in attr:
        return 2
    return 3

async def ingest_hadith():
    conn = await get_db_connection()
    
    collection_query = """
        INSERT INTO hadith_collections (name) VALUES ($1) ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name RETURNING id;
    """
    
    hadith_query = """
        INSERT INTO hadiths (hadeethenc_id, title, arabic_text, english_text, grade, explanation, hints, words_meanings, reference, collection_id, source_tier)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (hadeethenc_id) DO NOTHING;
    """
    
    try:
        async with httpx.AsyncClient() as client:
            categories = await fetch_categories(client)
            for cat in tqdm(categories, desc="Categories"):
                cat_id = cat['id']
                page = 1
                while True:
                    data = await fetch_hadith_list(client, cat_id, page)
                    hadiths = data.get('data', [])
                    if not hadiths:
                        break
                    
                    for h_info in hadiths:
                        h_id = h_info['id']
                        
                        exists = await conn.fetchval("SELECT 1 FROM hadiths WHERE hadeethenc_id = $1", h_id)
                        if exists:
                            continue
                            
                        details = await fetch_hadith_details(client, h_id)
                        if not details:
                            await asyncio.sleep(1)
                            continue
                        
                        attr = details.get('attribution', 'Unknown')
                        coll_id = await conn.fetchval(collection_query, attr)
                        
                        tier = determine_tier(attr)
                        
                        await conn.execute(hadith_query,
                            h_id,
                            details.get('title', ''),
                            details.get('hadeeth', ''),
                            h_info.get('title', ''),
                            details.get('grade', ''),
                            details.get('explanation', ''),
                            "\\n".join(details.get('hints', [])),
                            str(details.get('words_meanings', [])),
                            details.get('reference', ''),
                            coll_id,
                            tier
                        )
                        await asyncio.sleep(1)
                    page += 1
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(ingest_hadith())
