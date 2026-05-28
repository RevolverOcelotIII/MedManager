import redis
import os
import json
import logging
from typing import Optional, Any

logger = logging.getLogger(__name__)

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")

class RedisClient:
    _instance: Optional[redis.Redis] = None

    @classmethod
    def get_client(cls) -> redis.Redis:
        if cls._instance is None:
            try:
                cls._instance = redis.Redis.from_url(
                    REDIS_URL, 
                    decode_responses=True, 
                    socket_timeout=5
                )
                cls._instance.ping()
                logger.info("Connected to Redis")
            except Exception as e:
                logger.error(f"Failed to connect to Redis: {e}")
                # We return a dummy client or handle it in methods to fail gracefully
        return cls._instance

def get_cache(key: str) -> Optional[Any]:
    client = RedisClient.get_client()
    if client is None:
        return None
    try:
        data = client.get(key)
        if data:
            return json.loads(data)
    except Exception as e:
        logger.error(f"Error reading from Redis: {e}")
    return None

def set_cache(key: str, data: Any, ttl: int = 3600):
    client = RedisClient.get_client()
    if client is None:
        return
    try:
        client.setex(key, ttl, json.dumps(data))
    except Exception as e:
        logger.error(f"Error writing to Redis: {e}")

def invalidate_cache(key_pattern: str):
    client = RedisClient.get_client()
    if client is None:
        return
    try:
        keys = client.keys(key_pattern)
        if keys:
            client.delete(*keys)
            logger.info(f"Invalidated {len(keys)} cache keys matching {key_pattern}")
    except Exception as e:
        logger.error(f"Error invalidating Redis cache: {e}")
