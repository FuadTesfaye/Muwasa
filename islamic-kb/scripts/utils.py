import re
import os
import asyncpg
from dotenv import load_dotenv
root_dir = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
load_dotenv(os.path.join(root_dir, ".env"))
load_dotenv()

async def get_db_connection():
    db_url = os.environ.get("DATABASE_URL") or os.environ.get("SUPABASE_DB_URL")
    if not db_url:
        raise ValueError("DATABASE_URL or SUPABASE_DB_URL must be set in environment")
    return await asyncpg.connect(db_url)

def normalize_arabic(text: str) -> str:
    """
    Normalizes Arabic text:
    - remove harakat (\u064B-\u065F)
    - remove tatweel (\u0640)
    - normalize hamza variants (إأآء -> ا)
    - normalize ta marbuta (ة -> ه)
    - normalize alif maqsura (ى -> ي)
    """
    if not text:
        return ""
    # Remove harakat
    text = re.sub(r'[\u064B-\u065F]', '', text)
    # Remove tatweel
    text = re.sub(r'\u0640', '', text)
    # Normalize hamza
    text = re.sub(r'[إأآء]', 'ا', text)
    # Normalize ta marbuta
    text = re.sub(r'ة', 'ه', text)
    # Normalize alif maqsura
    text = re.sub(r'ى', 'ي', text)
    return text
