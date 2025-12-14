// src/config/redis.ts
import { createClient } from 'redis';

export const redis = createClient({
  url: process.env.REDIS_URL ?? '' // avoid TS error
});

export async function connectRedis() {
  if (process.env.NODE_ENV === 'test') return; // don’t connect in tests
  if (!redis.isOpen) await redis.connect();
}