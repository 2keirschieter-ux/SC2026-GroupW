'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CardVisual } from '@/components/card-visual';

type BoosterCard = {
  cardId: string;
  instanceId: string | null;
  type: 'country' | 'capital' | 'flag' | 'special';
  name: string;
  countryName?: string;
  description?: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary' | 'special';
  countryCode?: string;
  continent?: string;
  flagUrl?: string;
  imageUrl?: string | null;
  imageCredit?: string | null;
};

type BoosterPhase = 'idle' | 'opening' | 'revealing';

function cardDescription(card: BoosterCard) {
  if (card.type === 'country') return `${card.countryName ?? card.name} · ${card.continent ?? 'Country'}`;
  if (card.type === 'capital') return `Capital of ${card.countryName ?? 'this country'}`;
  if (card.type === 'flag') return `${card.countryName ?? card.name} national flag`;
  return card.description || 'Limited special card';
}

export default function Booster() {
  const [cards, setCards] = useState<BoosterCard[]>([]);
  const [error, setError] = useState('');
  const [opening, setOpening] = useState(false);
  const [phase, setPhase] = useState<BoosterPhase>('idle');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (phase !== 'opening') return;
    const timer = window.setTimeout(() => setPhase('revealing'), 1000);
    return () => window.clearTimeout(timer);
  }, [phase]);

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
        setPhase('idle');
        return;
      }
      setCards(data.cards);
      setCurrentIndex(0);
      setPhase('opening');
    } catch {
      setError('The booster service is temporarily unavailable. Please try again.');
      setCards([]);
      setPhase('idle');
    } finally {
      setOpening(false);
    }
  }

  const card = cards[currentIndex];

  return (
    <>
      <h1>Open a booster</h1>
      {phase === 'idle' && (
        <button className="booster-pack-button" onClick={open} disabled={opening} aria-label="Open booster">
          <span className="booster-pack booster-pack--sealed" aria-hidden="true">
            <span className="booster-pack__tear-line" />
            <span className="booster-pack__brand">WORLD<br />CARDS</span>
            <span className="booster-pack__hint">PRESS TO TEAR</span>
          </span>
          <span>{opening ? 'Opening...' : 'Click the booster to open it'}</span>
        </button>
      )}
      {error && <p role="alert">{error}</p>}
      {phase === 'opening' && (
        <section className="booster-opening" aria-live="polite" aria-label="Opening booster">
          <div className="booster-pack booster-pack--tearing" aria-hidden="true">
            <span className="booster-pack__tear-line" />
            <span className="booster-pack__brand">WORLD<br />CARDS</span>
          </div>
          <p>Opening your booster...</p>
        </section>
      )}
      {phase === 'revealing' && card && (
        <section className="booster-reveal" aria-live="polite">
          <p className="booster-progress">Card {currentIndex + 1} of {cards.length}</p>
          <article className={`card card--${card.rarity} booster-card`} key={`${card.cardId}-${currentIndex}`}>
            <CardVisual type={card.type} rarity={card.rarity} countryCode={card.countryCode} continent={card.continent} flagUrl={card.flagUrl} imageUrl={card.imageUrl} imageCredit={card.imageCredit} countryName={card.countryName ?? card.name} />
            <div className="card-content">
              <h2>{card.name}</h2>
              <p>{cardDescription(card)}</p>
            </div>
          </article>
          <div className="booster-controls">
            <button onClick={() => setCurrentIndex((index) => index - 1)} disabled={currentIndex === 0}>Previous</button>
            <button onClick={() => setCurrentIndex((index) => index + 1)} disabled={currentIndex === cards.length - 1}>Next card</button>
          </div>
          {currentIndex === cards.length - 1 && (
            <>
              <p>All cards revealed.</p>
              <Link className="booster-return" href="/collection">Return to collection</Link>
            </>
          )}
        </section>
      )}
    </>
  );
}
