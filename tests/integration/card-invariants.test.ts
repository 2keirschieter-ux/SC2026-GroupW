import { describe, expect, it } from 'vitest';
import { stockDelta } from '@/lib/cards/admin-special-cards';

describe('card stock invariants', () => {
  it('never permits a negative requested stock or a reduction below assignments', () => {
    expect(() => stockDelta(2, 1, -1)).toThrow('INVALID_STOCK');
    expect(() => stockDelta(2, 2, 1)).toThrow('STOCK_TOO_LOW');
  });
});
