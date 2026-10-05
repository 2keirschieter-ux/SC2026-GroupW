import { describe, expect, it } from 'vitest';
import { rarityForPopulation, validateProbabilities } from '@/lib/cards/rarity';
const c={commonMaxPopulation:10000000,uncommonMaxPopulation:1000000,rareMaxPopulation:100000,epicMaxPopulation:10000,probabilities:{common:.5,uncommon:.2,rare:.15,epic:.1,legendary:.05}};
describe('rarity',()=>{it('handles thresholds',()=>{expect(rarityForPopulation(1,c)).toBe('legendary');expect(rarityForPopulation(10000000,c)).toBe('legendary');expect(rarityForPopulation(10000001,c)).toBe('common')});it('rejects invalid population and probabilities',()=>{expect(()=>rarityForPopulation(0,c)).toThrow();expect(()=>validateProbabilities({common:2})).toThrow()})});
