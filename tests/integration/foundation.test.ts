import { describe, expect, it } from 'vitest';
import { z } from 'zod';

const schema = z.object({
  cardType: z.enum(['country', 'capital', 'flag', 'special']),
  cardInstanceId: z.string().uuid().nullable(),
});

describe('foundation ownership invariants', () => {
  it('models base cards without a physical instance', () => {
    expect(schema.parse({ cardType: 'country', cardInstanceId: null }).cardInstanceId).toBeNull();
  });

  it('models special cards with a physical instance', () => {
    expect(schema.parse({ cardType: 'special', cardInstanceId: crypto.randomUUID() }).cardType).toBe('special');
  });
});
