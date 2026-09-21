import os
import asyncio
from tqdm import tqdm
from utils import get_db_connection, normalize_arabic
import openai

async def generate_embeddings():
    conn = await get_db_connection()
    client = openai.AsyncOpenAI(api_key=os.environ.get("OPENAI_API_KEY"))
    
    print("Generating embeddings for Quran verses...")
    verses = await conn.fetch("""
        SELECT q.surah_id, q.ayah_number, q.text_simple_clean, t.text as english, f.text as tafsir
        FROM quran_verses q
        LEFT JOIN quran_translations t ON q.surah_id = t.surah_id AND q.ayah_number = t.ayah_number AND t.translation_key = 'english_saheeh'
        LEFT JOIN quran_tafsirs f ON q.surah_id = f.surah_id AND q.ayah_number = f.ayah_number AND f.translation_key = 'english_mokhtasar'
        WHERE q.embedding IS NULL
    """)
    
    for v in tqdm(verses, desc="Quran Embeddings"):
        text_to_embed = f"{normalize_arabic(v['text_simple_clean'])} | {v['english'] or ''} | {v['tafsir'] or ''}"
        
        try:
            res = await client.embeddings.create(input=[text_to_embed], model="text-embedding-3-large", dimensions=1024)
            emb = res.data[0].embedding
            await conn.execute("UPDATE quran_verses SET embedding = $1 WHERE surah_id = $2 AND ayah_number = $3", emb, v['surah_id'], v['ayah_number'])
        except Exception as e:
            print(f"Error embedding verse {v['surah_id']}:{v['ayah_number']}: {e}")

    print("Generating embeddings for Hadiths...")
    hadiths = await conn.fetch("SELECT hadeethenc_id, arabic_text, english_text, explanation FROM hadiths WHERE embedding IS NULL")
    
    for h in tqdm(hadiths, desc="Hadith Embeddings"):
        text_to_embed = f"{normalize_arabic(h['arabic_text'])} | {h['english_text'] or ''} | {h['explanation'] or ''}"
        try:
            res = await client.embeddings.create(input=[text_to_embed], model="text-embedding-3-large", dimensions=1024)
            emb = res.data[0].embedding
            await conn.execute("UPDATE hadiths SET embedding = $1 WHERE hadeethenc_id = $2", emb, h['hadeethenc_id'])
        except Exception as e:
            print(f"Error embedding hadith {h['hadeethenc_id']}: {e}")
            
    await conn.close()

if __name__ == "__main__":
    asyncio.run(generate_embeddings())
