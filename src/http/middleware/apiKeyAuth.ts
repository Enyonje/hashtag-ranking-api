// src/http/middleware/apiKeyAuth.ts
import { Request, Response, NextFunction } from 'express';

export function apiKeyAuth(req: Request, res: Response, next: NextFunction) {
  if (process.env.NODE_ENV === 'test') return next(); // bypass in tests

  const headerKey = req.header('x-api-key');
  const expected = process.env.API_KEY;
  if (!expected) return res.status(500).json({ error: 'Server misconfigured: missing API_KEY' });
  if (!headerKey || headerKey !== expected) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}