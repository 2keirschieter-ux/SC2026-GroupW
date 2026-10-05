import { describe, expect, it } from 'vitest';
import { publicUser } from '@/lib/api/serializers';

describe('authentication boundaries', () => {
  it('serializes public identity without password hashes', () => {
    const result = publicUser({ id: 'user-1', email: 'player@example.com', role: 'player' });
    expect(result).not.toHaveProperty('passwordHash');
    expect(result.email).toBe('player@example.com');
  });
});
