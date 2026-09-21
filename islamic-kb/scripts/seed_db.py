import asyncio
import sys
from ingest_tanzil import ingest_tanzil
from ingest_quranenc import ingest_quranenc
from ingest_hadith import ingest_hadith
from generate_embeddings import generate_embeddings
from validate_sources import validate_sources

async def main():
    print("Starting Islamic KB Database Seeding...")
    try:
        print("\\n--- 1. Ingesting Tanzil Quran ---")
        await ingest_tanzil()
        
        print("\\n--- 2. Ingesting QuranEnc Translations & Tafsirs ---")
        await ingest_quranenc()
        
        print("\\n--- 3. Ingesting HadithEnc ---")
        await ingest_hadith()
        
        print("\\n--- 4. Generating Embeddings ---")
        await generate_embeddings()
        
        print("\\n--- 5. Validating Sources ---")
        await validate_sources()
        
        print("\\nSeeding Completed Successfully!")
    except Exception as e:
        print(f"Seeding failed: {e}", file=sys.stderr)

if __name__ == "__main__":
    asyncio.run(main())
