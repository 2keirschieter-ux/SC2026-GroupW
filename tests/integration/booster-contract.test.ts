import { describe, expect, it } from 'vitest';
import { bundleSize } from '@/lib/cards/draw-rules';
import { idempotencySchema } from '@/lib/validation/schemas';

describe('booster contract', () => {
  it('requires an idempotency key and always uses five cards', () => {
    expect(idempotencySchema.safeParse({ idempotencyKey: 'opening-123' }).success).toBe(true);
    expect(idempotencySchema.safeParse({ idempotencyKey: 'short' }).success).toBe(false);
    expect(bundleSize).toBe(5);
  });
});
