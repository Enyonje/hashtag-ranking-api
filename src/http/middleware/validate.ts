import { ZodSchema } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from '../../core/errors';

export function validateQuery(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);
    if (!parsed.success) return next(BadRequest(parsed.error.issues.map(i => i.message).join(', ')));
    (req as any).validatedQuery = parsed.data;
    next();
  };
}