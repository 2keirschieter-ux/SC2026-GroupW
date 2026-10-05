import { db } from '@/lib/db/client';
import { hashPassword } from './passwords';
import { createSession } from './session';
export async function register(email: string, password: string) { const user = await db.user.create({ data: { email, passwordHash: await hashPassword(password) } }); await createSession(user.id); return { id: user.id, email: user.email, role: user.role }; }
