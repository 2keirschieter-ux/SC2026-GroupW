import { z } from 'zod';
const schema = z.object({ DATABASE_URL: z.string().min(1), SESSION_SECRET: z.string().min(16) });
export function config() {
  const result = schema.safeParse({ DATABASE_URL: process.env.DATABASE_URL, SESSION_SECRET: process.env.SESSION_SECRET });
  if (!result.success) throw new Error(`Invalid environment: ${result.error.message}`);
  return result.data;
}
