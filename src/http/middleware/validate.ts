import { ZodSchema, ZodError } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { BadRequest } from '../../core/errors';

export function validateQuery<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    const parsed = schema.safeParse(req.query);

    if (!parsed.success) {
      const messages = parsed.error.issues
        .map((i: ZodError['issues'][number]) => i.message) // ✅ typed callback
        .join(', ');
      return next(BadRequest(messages));
    }

    // Attach validated query to request
    (req as any).validatedQuery = parsed.data;
    next();
  };
}