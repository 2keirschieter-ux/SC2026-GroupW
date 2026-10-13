import { NextResponse } from 'next/server';
import { Prisma } from '@prisma/client';
import { currentUser } from '@/lib/auth/session';
import { db } from '@/lib/db/client';
import { profileUpdateSchema } from '@/lib/validation/schemas';

export async function GET() {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in required' } }, { status: 401 });
  const cardCount = await db.userCard.count({ where: { userId: user.id } });
  return NextResponse.json({ user: { id: user.id, email: user.email, username: user.username, role: user.role, createdAt: user.createdAt, cardCount } });
}

export async function PATCH(request: Request) {
  const user = await currentUser();
  if (!user) return NextResponse.json({ error: { code: 'UNAUTHENTICATED', message: 'Sign in required' } }, { status: 401 });
  const parsed = profileUpdateSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: { code: 'VALIDATION', message: 'Invalid profile information' } }, { status: 400 });
  try {
    const updated = await db.user.update({
      where: { id: user.id },
      data: parsed.data,
      select: { id: true, email: true, username: true, role: true, createdAt: true },
    });
    return NextResponse.json({ user: updated });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      const target = Array.isArray(error.meta?.target) ? error.meta.target.join(',') : String(error.meta?.target ?? '');
      const code = target.includes('email') ? 'EMAIL_TAKEN' : 'USERNAME_TAKEN';
      const message = code === 'EMAIL_TAKEN' ? 'This email address is already taken' : 'This username is already taken';
      return NextResponse.json({ error: { code, message } }, { status: 409 });
    }
    throw error;
  }
}
