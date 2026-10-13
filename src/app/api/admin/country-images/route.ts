import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { db } from '@/lib/db/client';
import { fetchWikimediaImage } from '@/lib/media/wikimedia';

export async function GET() {
  try {
    await requireAdmin();
    const cards = await db.card.findMany({
      where: { cardType: 'country' },
      include: { country: { select: { name: true, externalCode: true } } },
    });
    cards.sort((left, right) => left.country.name.localeCompare(right.country.name));
    return NextResponse.json({ cards });
  } catch (error) {
    if (error instanceof Error && (error.message === 'FORBIDDEN' || error.message === 'UNAUTHENTICATED')) {
      const status = error.message === 'FORBIDDEN' ? 403 : 401;
      return NextResponse.json({ error: { code: error.message, message: status === 403 ? 'Administrator access required' : 'Sign in required' } }, { status });
    }
    console.error('[Country images] Failed to load cards:', error);
    return NextResponse.json({ error: { code: 'FAILED', message: 'Unable to load country images' } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as { cardId?: string };
    if (!body.cardId) return NextResponse.json({ error: { code: 'VALIDATION', message: 'cardId is required' } }, { status: 400 });
    const card = await db.card.findUnique({ where: { id: body.cardId }, include: { country: true } });
    if (!card || card.cardType !== 'country') return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Country card not found' } }, { status: 404 });
    const image = await fetchWikimediaImage(card.country.name, 'country', undefined, card.imageUrl ? [card.imageUrl] : []);
    if (!image) return NextResponse.json({ error: { code: 'IMAGE_NOT_FOUND', message: 'No alternative landscape image found' } }, { status: 404 });
    const updated = await db.card.update({ where: { id: card.id }, data: { imageUrl: image.imageUrl, imageCredit: image.imageCredit }, include: { country: { select: { name: true, externalCode: true } } } });
    return NextResponse.json({ card: updated });
  } catch (error) {
    if (error instanceof Error && (error.message === 'FORBIDDEN' || error.message === 'UNAUTHENTICATED')) {
      const status = error.message === 'FORBIDDEN' ? 403 : 401;
      return NextResponse.json({ error: { code: error.message, message: status === 403 ? 'Administrator access required' : 'Sign in required' } }, { status });
    }
    console.error('[Country images] Failed to replace image:', error);
    return NextResponse.json({ error: { code: 'FAILED', message: 'Unable to replace country image' } }, { status: 500 });
  }
}
