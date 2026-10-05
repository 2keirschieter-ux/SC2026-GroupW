import { describe, expect, it } from 'vitest';
import { stockDelta } from '@/lib/cards/admin-special-cards';

describe('administrator stock adjustments', () => {
  it('computes additions and removals from total capacity', () => {
    expect(stockDelta(2, 1, 4)).toBe(2);
    expect(stockDelta(4, 1, 2)).toBe(-2);
  });
});
