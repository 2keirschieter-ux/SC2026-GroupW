import { z } from 'zod';
export const credentialsSchema = z.object({ email: z.string().trim().toLowerCase().email(), password: z.string().min(8).max(128) });
export const profileSchema = z.object({ username: z.string().trim().min(3).max(24).regex(/^[A-Za-z0-9_ -]+$/) });
export const idempotencySchema = z.object({ idempotencyKey: z.string().min(8).max(200) });
export const collectionQuerySchema = z.object({ type: z.enum(['country','capital','flag','special']).optional(), rarity: z.enum(['common','uncommon','rare','epic','legendary','special']).optional(), continent: z.string().max(80).optional(), search: z.string().max(100).optional() });
export const specialCardSchema = z.object({ countryId: z.string().uuid(), name: z.string().min(1).max(160), historicalKind: z.enum(['former_flag','former_capital','former_name']), description: z.string().min(1), sourceReference: z.string().url(), stockTotal: z.number().int().min(0) });
export function validationMessage(error: z.ZodError) { return error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join('; '); }
