import 'dotenv/config';
import { z } from 'zod';

const optionalSecret = z.string().optional().default('');
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(5000),
  CLIENT_ORIGIN: z.string().url().default('http://localhost:5173'),
  MONGODB_URI: z.string().default('mongodb://127.0.0.1:27017/ai_mystery_room'),
  GEMINI_API_KEY: optionalSecret,
  GEMINI_MODEL: z.string().default('gemini-3.8-flash'),
  SESSION_SECRET: z.string().min(32).default('local-development-secret-change-before-deploy'),
  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(900000),
  RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(30),
  MAX_SCENARIO_LENGTH: z.coerce.number().int().min(30).max(2000).default(2000),
  MAX_SUSPECTS: z.coerce.number().int().min(3).max(6).default(6),
  MAX_EVIDENCE_ITEMS: z.coerce.number().int().min(4).max(12).default(12)
});

const parsed = envSchema.safeParse(process.env);
if (!parsed.success) {
  throw new Error(`Invalid environment configuration: ${parsed.error.issues.map((issue) => issue.path.join('.')).join(', ')}`);
}

export const env = parsed.data;
export const isProduction = env.NODE_ENV === 'production';

