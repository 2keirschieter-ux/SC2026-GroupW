import { describe, expect, it } from 'vitest';
import { specialCardSchema } from '@/lib/validation/schemas';

describe('administrator special cards', () => {
  it('requires historical attribution and stock metadata', () => {
    expect(specialCardSchema.safeParse({
      countryId: crypto.randomUUID(),
      name: 'Former capital',
      historicalKind: 'former_capital',
      description: 'Historical record',
      sourceReference: 'https://example.com/source',
      stockTotal: 2,
    }).success).toBe(true);
  });
});
