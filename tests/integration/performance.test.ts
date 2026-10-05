import { describe, expect, it } from 'vitest';

describe('performance thresholds', () => {
  it('documents the version-one latency budgets', () => {
    const thresholds = { collectionAndDetailsMs: 1000, boosterMs: 2000 };
    expect(thresholds.collectionAndDetailsMs).toBeLessThanOrEqual(1000);
    expect(thresholds.boosterMs).toBeLessThanOrEqual(2000);
  });
});
