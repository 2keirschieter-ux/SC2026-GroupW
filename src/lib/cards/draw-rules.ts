import type { Rarity } from '@/types/domain';
import { validateProbabilities, type RarityConfig } from './rarity';
export function sampleRarity(config: RarityConfig, random = Math.random()): Rarity {
  validateProbabilities(config.probabilities);
  let cursor = 0;
  for (const rarity of ['common', 'uncommon', 'rare', 'epic', 'legendary', 'special'] as Rarity[]) {
    cursor += config.probabilities[rarity] ?? 0;
    if (random < cursor) return rarity;
  }
  return 'special';
}
export const bundleSize = 5;
