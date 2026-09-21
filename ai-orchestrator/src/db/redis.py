import redis.asyncio as redis
import logging
from typing import Optional
from src.config import settings

logger = logging.getLogger(__name__)

class RedisClient:
    def __init__(self):
        self.client: Optional[redis.Redis] = None

    async def connect(self):
        if not self.client:
            logger.info("Connecting to Redis...")
            self.client = redis.from_url(settings.redis_url, decode_responses=True)
            await self.client.ping()
            logger.info("Redis connected.")

    async def close(self):
        if self.client:
            logger.info("Closing Redis connection...")
            await self.client.close()
            logger.info("Redis connection closed.")
            
    def get_client(self) -> redis.Redis:
        if not self.client:
            raise RuntimeError("Redis client is not initialized")
        return self.client

redis_client = RedisClient()
