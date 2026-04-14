import os

redis_client = None

try:
    import redis
    url = os.getenv("REDIS_URL")
    if url:
        redis_client = redis.from_url(url)
except:
    redis_client = None
