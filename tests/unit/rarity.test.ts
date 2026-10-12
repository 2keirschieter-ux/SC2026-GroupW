import { describe, expect, it } from 'vitest';
import { rarityForPopulation, validateProbabilities, validateThresholds } from '@/lib/cards/rarity';

const c = {
  commonMaxPopulation: 10_000_000,
  uncommonMaxPopulation: 40_000_000,
  rareMaxPopulation: 75_000_000,
  epicMaxPopulation: 225_000_000,
  probabilities: { common: .5, uncommon: .2, rare: .15, epic: .1, legendary: .05 },
};

describe('rarity', () => {
  it('makes the largest populations the rarest', () => {
    expect(rarityForPopulation(1, c)).toBe('common');
    expect(rarityForPopulation(10_000_000, c)).toBe('common');
    expect(rarityForPopulation(10_000_001, c)).toBe('uncommon');
    expect(rarityForPopulation(40_000_000, c)).toBe('uncommon');
    expect(rarityForPopulation(40_000_001, c)).toBe('rare');
    expect(rarityForPopulation(75_000_000, c)).toBe('rare');
    expect(rarityForPopulation(75_000_001, c)).toBe('epic');
    expect(rarityForPopulation(225_000_000, c)).toBe('epic');
    expect(rarityForPopulation(225_000_001, c)).toBe('legendary');
  });

  it('never assigns the explicit special tier from population', () => {
    const results = [1, 10_000_000, 40_000_001, 75_000_001, 225_000_001].map((population) => rarityForPopulation(population, c));
    expect(results).not.toContain('special');
    expect(results).toEqual(['common', 'common', 'rare', 'epic', 'legendary']);
  });

  it('rejects invalid population, thresholds, and probabilities', () => {
    expect(() => rarityForPopulation(0, c)).toThrow('INVALID_POPULATION');
    expect(() => rarityForPopulation(1, { ...c, rareMaxPopulation: 50 })).toThrow('INVALID_THRESHOLDS');
    expect(() => validateThresholds({ ...c, epicMaxPopulation: 1.5 })).toThrow('INVALID_THRESHOLDS');
    expect(() => validateProbabilities({ common: 2 })).toThrow('INVALID_PROBABILITIES');
  });
});
