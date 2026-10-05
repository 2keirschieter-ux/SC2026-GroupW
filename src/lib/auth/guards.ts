import { currentUser } from './session';
export async function requireUser() { const user = await currentUser(); if (!user) throw new Error('UNAUTHENTICATED'); return user; }
export async function requireAdmin() { const user = await requireUser(); if (user.role !== 'admin') throw new Error('FORBIDDEN'); return user; }
