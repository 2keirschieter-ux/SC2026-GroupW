import { describe, expect, it } from 'vitest';
import { requireAdmin } from '@/lib/auth/guards';

describe('administrator authorization', () => {
  it('exposes a dedicated administrator guard', () => {
    expect(requireAdmin).toBeTypeOf('function');
  });
});
