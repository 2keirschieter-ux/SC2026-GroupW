import { describe, expect, it } from 'vitest';
import { stockDelta } from '@/lib/cards/admin-special-cards';

describe('special stock adjustments', () => {
  it('returns the exact capacity delta', () => {
    expect(stockDelta(3, 2, 5)).toBe(2);
    expect(stockDelta(5, 2, 2)).toBe(-3);
  });
  it('rejects totals below assigned copies and negative totals', () => {
    expect(() => stockDelta(5, 3, 2)).toThrow('STOCK_TOO_LOW');
    expect(() => stockDelta(5, 0, -1)).toThrow('INVALID_STOCK');
  });
});
