import { describe, expect, it } from 'vitest';
import { stockDelta } from '@/lib/cards/admin-special-cards';

describe('special stock allocation', () => {
  it('supports increasing capacity and rejects exhausted reductions', () => {
    expect(stockDelta(1, 0, 3)).toBe(2);
    expect(() => stockDelta(1, 1, 0)).toThrow('STOCK_TOO_LOW');
  });
});
