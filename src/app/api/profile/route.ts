import { NextResponse } from 'next/server';
import { currentUser } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { profileSchema } from '@/lib/validation/schemas';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in required' } }, { status: 401 });
  return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role, createdAt: user.createdAt } });
}

export async function PATCH(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in required' } }, { status: 401 });
  const parsed = profileSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: { code: 'VALIDATION', message: 'Invalid username' } }, { status: 400 });
  try {
    const updated = await db.user.update({
      where: { id: user.id },
      data: { username: parsed.data.username },
      select: { id: true, email: true, username: true, role: true, createdAt: true },
    });
    return NextResponse.json({ user: updated });
  } catch (error) {
    if (error instanceof Error && error.message.includes('User_username_key')) {
      return NextResponse.json({ error: { code: 'USERNAME_TAKEN', message: 'This username is already taken' } }, { status: 409 });
    }
    throw error;
  }
}
