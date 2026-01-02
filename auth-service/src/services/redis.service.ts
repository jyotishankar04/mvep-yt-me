// src/services/redis.service.ts
import Redis from "ioredis";

class RedisService {
  private client: Redis;

  constructor() {
    this.client = new Redis(process.env.REDIS_URL!);
  }

  async set(key: string, value: string, ttlSeconds?: number) {
    if (ttlSeconds) {
      await this.client.set(key, value, "EX", ttlSeconds);
    } else {
      await this.client.set(key, value);
    }
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async del(key: string) {
    await this.client.del(key);
  }

  async incr(key: string) {
    return this.client.incr(key);
  }

  async decr(key: string) {
    return this.client.decr(key);
  }

  async expire(key: string, ttlSeconds: number) {
    await this.client.expire(key, ttlSeconds);
  }
}

export default RedisService;
