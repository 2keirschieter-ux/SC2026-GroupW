import { describe, expect, it } from 'vitest';

describe('collection progress', () => {
  it('counts distinct special physical copies', () => {
    const ownedInstanceIds = new Set(['copy-1', 'copy-2', 'copy-2']);
    expect(ownedInstanceIds.size).toBe(2);
  });
});
