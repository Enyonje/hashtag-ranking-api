import { Request, Response, NextFunction } from 'express';
import { redis } from '../../config/redis';

const WINDOW = 60; // seconds
const LIMIT = 120;

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
  const key = (req as any).apiKey || req.ip;
  const bucketKey = `rl:${key}`;
  const tx = redis.multi();
  tx.incr(bucketKey);
  tx.expire(bucketKey, WINDOW);
  const [count] = (await tx.exec()) as unknown as [number, unknown];
  if ((count as number) > LIMIT) return res.status(429).json({ error: 'Rate limit exceeded' });
  next();
}