import 'dotenv/config';
import { z } from 'zod';

const EnvSchema = z.object({
  PORT: z.coerce.number().int().min(1).default(8080),
  MONGO_URI: z.string().url().or(z.string().min(1)),
  REDIS_URL: z.string().url().or(z.string().min(1)),
  API_KEYS: z.string().default(''),
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  STRIPE_KEY: z.string().optional()
});

const parsed = EnvSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = {
  port: parsed.data.PORT,
  mongoUri: parsed.data.MONGO_URI,
  redisUrl: parsed.data.REDIS_URL,
  apiKeys: parsed.data.API_KEYS
    .split(',')
    .map((k: string) => k.trim())   // ✅ typed callback
    .filter((k: string) => Boolean(k)), // ✅ typed callback
  nodeEnv: parsed.data.NODE_ENV,
  stripeKey: parsed.data.STRIPE_KEY
};