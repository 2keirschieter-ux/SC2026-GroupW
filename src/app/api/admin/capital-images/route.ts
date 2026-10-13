import { NextResponse } from 'next/server';
import { requireAdmin } from '@/lib/auth/guards';
import { db } from '@/lib/db/client';
import { fetchWikimediaImage } from '@/lib/media/wikimedia';

function authError(error: unknown) {
  if (error instanceof Error && (error.message === 'FORBIDDEN' || error.message === 'UNAUTHENTICATED')) {
    const status = error.message === 'FORBIDDEN' ? 403 : 401;
    return NextResponse.json({ error: { code: error.message, message: status === 403 ? 'Administrator access required' : 'Sign in required' } }, { status });
  }
  return null;
}

export async function GET() {
  try {
    await requireAdmin();
    const cards = await db.card.findMany({
      where: { cardType: 'capital' },
      include: { country: { select: { name: true, externalCode: true } } },
    });
    cards.sort((left, right) => left.name.localeCompare(right.name));
    return NextResponse.json({ cards });
  } catch (error) {
    const response = authError(error);
    if (response) return response;
    console.error('[Capital images] Failed to load cards:', error);
    return NextResponse.json({ error: { code: 'FAILED', message: 'Unable to load capital images' } }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
    const body = await request.json() as { cardId?: string };
    if (!body.cardId) return NextResponse.json({ error: { code: 'VALIDATION', message: 'cardId is required' } }, { status: 400 });
    const card = await db.card.findUnique({ where: { id: body.cardId }, include: { country: true } });
    if (!card || card.cardType !== 'capital' || !card.country.currentCapital) {
      return NextResponse.json({ error: { code: 'NOT_FOUND', message: 'Capital card not found' } }, { status: 404 });
    }
    const image = await fetchWikimediaImage(card.country.currentCapital, 'capital', card.country.name, card.imageUrl ? [card.imageUrl] : []);
    if (!image) return NextResponse.json({ error: { code: 'IMAGE_NOT_FOUND', message: 'No alternative capital image found' } }, { status: 404 });
    const updated = await db.card.update({
      where: { id: card.id },
      data: { imageUrl: image.imageUrl, imageCredit: image.imageCredit },
      include: { country: { select: { name: true, externalCode: true } } },
    });
    return NextResponse.json({ card: updated });
  } catch (error) {
    const response = authError(error);
    if (response) return response;
    console.error('[Capital images] Failed to replace image:', error);
    return NextResponse.json({ error: { code: 'FAILED', message: 'Unable to replace capital image' } }, { status: 500 });
  }
}
