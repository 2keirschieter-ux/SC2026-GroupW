'use client';

import { useEffect, useState } from 'react';
import { CardVisual } from '@/components/card-visual';
import type { CardType, Rarity } from '@/types/domain';

export type CollectionCard = {
  id: string;
  name: string;
  cardType: CardType;
  rarity: Rarity;
  countryName: string;
  countryCode: string;
  continent: string;
  currentFlag: string;
  imageUrl: string | null;
  description: string;
  historicalKind: string | null;
  quantity: number;
};

function summaryFor(card: CollectionCard) {
  if (card.cardType === 'country') return `${card.countryName} · ${card.continent}`;
  if (card.cardType === 'capital') return `Capital of ${card.countryName}`;
  if (card.cardType === 'flag') return `${card.countryName} national flag`;
  return card.description || 'Limited special card';
}

function detailedDescriptionFor(card: CollectionCard) {
  const rarity = card.rarity.charAt(0).toUpperCase() + card.rarity.slice(1);
  if (card.cardType === 'country') {
    return `${card.countryName} is represented here as a ${rarity.toLowerCase()} WorldCards country card. It belongs to the ${card.continent} collection and helps complete your world map. Every country card is a starting point for discovering places, people, and stories across the globe. Its rarity reflects the population bracket used by the game. Keep collecting cards from every continent to build a truly complete collection.`;
  }
  if (card.cardType === 'capital') {
    return `${card.name} is the capital card linked to ${card.countryName}. It belongs to the ${card.continent} collection and highlights the political heart of the country. Capital cards bring a geographic and cultural landmark into your collection. Its rarity follows the same population-based rules as the other standard cards. Collecting it alongside the country and flag creates a more complete set.`;
  }
  if (card.cardType === 'flag') {
    return `This is the national flag card of ${card.countryName}. It belongs to the ${card.continent} collection and gives the set its visual identity. Flags are a simple way to recognize a country and connect it to its place in the world. Its rarity is determined by the population bracket assigned to the country. Collect it with the matching country and capital cards to complete the trio.`;
  }
  return `${card.description || 'This limited card preserves a piece of historical memory.'} It is a special ${card.historicalKind ? card.historicalKind.replaceAll('_', ' ') : 'historical'} card connected to ${card.countryName}. Special cards are limited and can become some of the most distinctive pieces in a collection. Its animated border marks it as different from the standard country, capital, and flag cards. Keep it safe: once the available stock is gone, this piece becomes even harder to find.`;
}

export function CollectionCardGrid({ cards }: { cards: CollectionCard[] }) {
  const [selected, setSelected] = useState<CollectionCard | null>(null);

  useEffect(() => {
    if (!selected) return;
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null);
    };
    document.addEventListener('keydown', closeOnEscape);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', closeOnEscape);
      document.body.style.overflow = '';
    };
  }, [selected]);

  return (
    <>
      <div className="grid">
        {cards.map((card) => (
          <button className={`card card--${card.rarity} collection-card-trigger`} key={card.id} onClick={() => setSelected(card)} type="button" aria-label={`Open ${card.name}`}>
            <CardVisual type={card.cardType} rarity={card.rarity} countryCode={card.countryCode} continent={card.continent} flagUrl={card.currentFlag} imageUrl={card.imageUrl} countryName={card.countryName} />
            {card.quantity > 1 && <span className="card-quantity" aria-label={`${card.quantity} copies`}>×{card.quantity}</span>}
            <div className="card-content">
              <h2>{card.name}</h2>
              <p>{summaryFor(card)}</p>
            </div>
          </button>
        ))}
      </div>
      {!cards.length && <p>No cards match these filters.</p>}
      {selected && (
        <div className="card-modal-backdrop" role="presentation" onClick={() => setSelected(null)}>
          <section className="card-modal" role="dialog" aria-modal="true" aria-labelledby="selected-card-title" onClick={(event) => event.stopPropagation()}>
            <button className="card-modal-close" type="button" onClick={() => setSelected(null)} aria-label="Close card preview">×</button>
            <article className={`card card--${selected.rarity} card-modal-card`}>
              <CardVisual type={selected.cardType} rarity={selected.rarity} countryCode={selected.countryCode} continent={selected.continent} flagUrl={selected.currentFlag} imageUrl={selected.imageUrl} countryName={selected.countryName} />
              <div className="card-content">
                <h2 id="selected-card-title">{selected.name}</h2>
                <p className="card-modal-description">{detailedDescriptionFor(selected)}</p>
              </div>
            </article>
          </section>
        </div>
      )}
    </>
  );
}
