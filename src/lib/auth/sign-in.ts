import { db } from '@/lib/db/client';
import { verifyPassword } from './passwords';
import { createSession, destroySession } from './session';
export async function signIn(email: string, password: string) { const user = await db.user.findUnique({ where: { email } }); if (!user || !(await verifyPassword(password, user.passwordHash))) throw new Error('INVALID_CREDENTIALS'); await createSession(user.id); return { id: user.id, email: user.email, role: user.role }; }
export const signOut = destroySession;
