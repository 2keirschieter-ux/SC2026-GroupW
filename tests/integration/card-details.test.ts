import { describe, expect, it } from 'vitest';
import { publicCard } from '@/lib/api/serializers';

describe('card details contract', () => {
  it('returns display-safe card fields and instance identifiers only', () => {
    const card = publicCard({
      id: 'card-1',
      cardType: 'special',
      countryId: 'country-1',
      name: 'Former flag',
      rarity: 'special',
      rarityConfigVersion: 'special-v1',
      description: 'Historical record',
      historicalKind: 'former_flag',
      stockTotal: 1,
      stockRemaining: 1,
      sourceReference: 'https://example.com/source',
      active: true,
    }, 'instance-1');
    expect(card).toMatchObject({ cardId: 'card-1', instanceId: 'instance-1', type: 'special' });
    expect(card).not.toHaveProperty('stockRemaining');
  });
});
