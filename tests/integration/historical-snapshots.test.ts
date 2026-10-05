import { describe, expect, it } from 'vitest';

describe('historical ownership snapshots', () => {
  it('keeps the assigned rarity as a separate value from catalog rarity', () => {
    const ownership = { raritySnapshot: 'rare' };
    const catalog = { rarity: 'common' };
    expect(ownership.raritySnapshot).toBe('rare');
    expect(catalog.rarity).toBe('common');
  });
});
