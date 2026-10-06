import type { Rarity } from '@/types/domain';

export type RarityConfig = {
  commonMaxPopulation: number;
  uncommonMaxPopulation: number;
  rareMaxPopulation: number;
  epicMaxPopulation: number;
  probabilities: Partial<Record<Rarity, number>>;
};

export function validateThresholds(c: RarityConfig) {
  const t = [c.commonMaxPopulation, c.uncommonMaxPopulation, c.rareMaxPopulation, c.epicMaxPopulation];
  if (t.some((v) => !Number.isInteger(v) || v <= 0) || t.some((v, i) => i > 0 && v <= t[i - 1])) {
    throw new Error('INVALID_THRESHOLDS');
  }
}

export function rarityForPopulation(population: number, c: RarityConfig): Rarity {
  if (!Number.isInteger(population) || population <= 0) throw new Error('INVALID_POPULATION');
  validateThresholds(c);
  if (population <= c.commonMaxPopulation) return 'common';
  if (population <= c.uncommonMaxPopulation) return 'uncommon';
  if (population <= c.rareMaxPopulation) return 'rare';
  if (population <= c.epicMaxPopulation) return 'epic';
  return 'legendary';
}

export function validateProbabilities(p: Record<string, number>) {
  const values = Object.values(p);
  if (values.some((v) => v < 0) || Math.abs(values.reduce((a, b) => a + b, 0) - 1) > 1e-9) {
    throw new Error('INVALID_PROBABILITIES');
  }
}
