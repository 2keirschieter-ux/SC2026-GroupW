import { describe, expect, it } from 'vitest';
import { rarityForPopulation, validateProbabilities, validateThresholds } from '@/lib/cards/rarity';

const c = {
  commonMaxPopulation: 10_000,
  uncommonMaxPopulation: 100_000,
  rareMaxPopulation: 1_000_000,
  epicMaxPopulation: 10_000_000,
  probabilities: { common: .5, uncommon: .2, rare: .15, epic: .1, legendary: .05 },
};

describe('rarity', () => {
  it('makes the largest populations the rarest', () => {
    expect(rarityForPopulation(1, c)).toBe('common');
    expect(rarityForPopulation(10_000, c)).toBe('common');
    expect(rarityForPopulation(10_001, c)).toBe('uncommon');
    expect(rarityForPopulation(100_000, c)).toBe('uncommon');
    expect(rarityForPopulation(100_001, c)).toBe('rare');
    expect(rarityForPopulation(1_000_000, c)).toBe('rare');
    expect(rarityForPopulation(1_000_001, c)).toBe('epic');
    expect(rarityForPopulation(10_000_000, c)).toBe('epic');
    expect(rarityForPopulation(10_000_001, c)).toBe('legendary');
  });

  it('rejects invalid population, thresholds, and probabilities', () => {
    expect(() => rarityForPopulation(0, c)).toThrow('INVALID_POPULATION');
    expect(() => rarityForPopulation(1, { ...c, rareMaxPopulation: 50 })).toThrow('INVALID_THRESHOLDS');
    expect(() => validateThresholds({ ...c, epicMaxPopulation: 1.5 })).toThrow('INVALID_THRESHOLDS');
    expect(() => validateProbabilities({ common: 2 })).toThrow('INVALID_PROBABILITIES');
  });
});
