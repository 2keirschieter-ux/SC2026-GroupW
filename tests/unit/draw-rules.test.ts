import { describe, expect, it } from 'vitest';
import { sampleRarity, bundleSize } from '@/lib/cards/draw-rules';
describe('draw rules',()=>{it('samples boundaries',()=>{const c:any={probabilities:{common:.5,uncommon:.2,rare:.15,epic:.1,legendary:.05}};expect(sampleRarity(c,0)).toBe('common');expect(sampleRarity(c,.99)).toBe('legendary')});it('uses five cards',()=>expect(bundleSize).toBe(5))});
