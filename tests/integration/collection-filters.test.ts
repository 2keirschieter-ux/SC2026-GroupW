import { describe, expect, it } from 'vitest';
import { collectionQuerySchema } from '@/lib/validation/schemas';

describe('collection filters', () => {
  it('accepts combinable type, rarity, continent, and search filters', () => {
    expect(collectionQuerySchema.parse({
      type: 'flag',
      rarity: 'rare',
      continent: 'Europe',
      search: 'fin',
    })).toMatchObject({ type: 'flag', rarity: 'rare', continent: 'Europe', search: 'fin' });
  });
});
