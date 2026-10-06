'use client';
import { useState } from 'react';
import { CardVisual } from '@/components/card-visual';
type BoosterCard = { cardId: string; instanceId: string | null; type: 'country' | 'capital' | 'flag' | 'special'; name: string; rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'special'; countryCode?: string; continent?: string; flagUrl?: string; imageUrl?: string | null; imageCredit?: string | null };

export default function Booster() {
  const [cards, setCards] = useState<BoosterCard[]>([]);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState(false);

  async function open() {
    setOpening(true);
    setError('');
    try {
      const response = await fetch('/api/boosters/open', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ idempotencyKey: crypto.randomUUID() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error?.code === 'STOCK_EXHAUSTED'
          ? 'This booster could not be completed because a special card is unavailable. No cards were added.'
          : data.error?.message || 'Unable to open booster');
        setCards([]);
        return;
      }
      setCards(data.cards);
    } catch {
      setError('The booster service is temporarily unavailable. Please try again.');
      setCards([]);
    } finally {
      setOpening(false);
    }
  }

  return (
    <>
      <h1>Open a booster</h1>
      <button onClick={open} disabled={opening}>
        {opening ? 'Opening...' : 'Open booster'}
      </button>
      {error && <p role="alert">{error}</p>}
      <div className="grid">
        {cards.map((card) => (
          <article className={`card card--${card.rarity}`} key={card.instanceId || card.cardId}>
            <CardVisual type={card.type} rarity={card.rarity} countryCode={card.countryCode} continent={card.continent} flagUrl={card.flagUrl} imageUrl={card.imageUrl} imageCredit={card.imageCredit} countryName={card.name} />
            <h2>{card.name}</h2>
            <p>{card.type} · {card.rarity}</p>
          </article>
        ))}
      </div>
    </>
  );
}
