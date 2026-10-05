import { describe, expect, it } from 'vitest';
import { credentialsSchema } from '@/lib/validation/schemas';

describe('authentication contract', () => {
  it('normalizes valid email credentials and rejects short passwords', () => {
    expect(credentialsSchema.parse({ email: ' Player@Example.com ', password: 'password' }).email).toBe('player@example.com');
    expect(credentialsSchema.safeParse({ email: 'player@example.com', password: 'short' }).success).toBe(false);
  });
});
