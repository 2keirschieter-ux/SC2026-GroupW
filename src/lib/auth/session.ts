import 'server-only';
import crypto from 'node:crypto';
import { cookies } from 'next/headers';
import { db } from '@/lib/db/client';
import { config } from '@/lib/config';
const COOKIE = 'worldcards_session';
const digest = (value: string) => crypto.createHmac('sha256', config().SESSION_SECRET).update(value).digest('hex');
export async function createSession(userId: string) { const token = crypto.randomBytes(32).toString('hex'); await db.session.create({ data: { userId, tokenHash: digest(token), expiresAt: new Date(Date.now() + 30*86400000) } }); (await cookies()).set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', expires: new Date(Date.now()+30*86400000), path: '/' }); }
export async function currentUser() { const token = (await cookies()).get(COOKIE)?.value; if (!token) return null; const session = await db.session.findUnique({ where: { tokenHash: digest(token) }, include: { user: true } }); if (!session || session.expiresAt < new Date()) return null; return session.user; }
export async function destroySession() { const token = (await cookies()).get(COOKIE)?.value; if (token) await db.session.deleteMany({ where: { tokenHash: digest(token) } }); (await cookies()).delete(COOKIE); }
