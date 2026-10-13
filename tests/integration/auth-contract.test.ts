import { describe, expect, it } from 'vitest';
import { credentialsSchema, profileUpdateSchema } from '@/lib/validation/schemas';

describe('authentication contract', () => {
  it('normalizes valid email credentials and rejects short passwords', () => {
    expect(credentialsSchema.parse({ email: ' Player@Example.com ', password: 'password' }).email).toBe('player@example.com');
    expect(credentialsSchema.safeParse({ email: 'player@example.com', password: 'short' }).success).toBe(false);
  });

  it('validates profile updates with a normalized email or username', () => {
    expect(profileUpdateSchema.parse({ email: ' Player@Example.com ' }).email).toBe('player@example.com');
    expect(profileUpdateSchema.safeParse({ username: 'ab' }).success).toBe(false);
    expect(profileUpdateSchema.safeParse({}).success).toBe(false);
  });
});
