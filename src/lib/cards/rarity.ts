import type { Rarity } from '@/types/domain';
export type RarityConfig = { commonMaxPopulation: number; uncommonMaxPopulation: number; rareMaxPopulation: number; epicMaxPopulation: number; probabilities: Partial<Record<Rarity, number>> };
export function rarityForPopulation(population: number, c: RarityConfig): Rarity {
  if (!Number.isInteger(population) || population <= 0) throw new Error('INVALID_POPULATION');
  if (population > c.commonMaxPopulation) return 'legendary';
  if (population > c.uncommonMaxPopulation) return 'epic';
  if (population > c.rareMaxPopulation) return 'rare';
  if (population > c.epicMaxPopulation) return 'uncommon';
  return 'common';
}
export function validateProbabilities(p: Record<string, number>) { const values = Object.values(p); if (values.some((v) => v < 0) || Math.abs(values.reduce((a,b)=>a+b,0)-1) > 1e-9) throw new Error('INVALID_PROBABILITIES'); }
