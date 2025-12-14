import { Request, Response, NextFunction } from 'express';
import { logger } from '../../core/logger';

export function errorHandler(err: any, req: Request, res: Response, _next: NextFunction) {
  const status = err.status ?? 500;
  logger.error({ err, path: req.path, requestId: (req as any).requestId }, 'Request error');
  res.status(status).json({ error: err.message ?? 'Internal Server Error', requestId: (req as any).requestId });
}