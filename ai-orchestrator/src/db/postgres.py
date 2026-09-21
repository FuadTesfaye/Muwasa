import asyncpg
from pgvector.asyncpg import register_vector
import logging
from typing import Optional
from src.config import settings

logger = logging.getLogger(__name__)

class PostgresPool:
    def __init__(self):
        self.pool: Optional[asyncpg.Pool] = None

    async def connect(self):
        if not self.pool:
            logger.info("Connecting to PostgreSQL...")
            self.pool = await asyncpg.create_pool(
                dsn=settings.supabase_db_url,
                min_size=1,
                max_size=10
            )
            
            # Register pgvector
            async with self.pool.acquire() as conn:
                await register_vector(conn)
            logger.info("PostgreSQL connected and pgvector registered.")

    async def close(self):
        if self.pool:
            logger.info("Closing PostgreSQL connection pool...")
            await self.pool.close()
            logger.info("PostgreSQL connection closed.")

    async def get_connection(self):
        if not self.pool:
            raise RuntimeError("Database pool is not initialized")
        return self.pool.acquire()

db_pool = PostgresPool()
