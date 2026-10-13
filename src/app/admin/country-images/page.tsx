'use client';

import { useEffect, useState } from 'react';

type CountryCard = { id: string; name: string; imageUrl: string | null; country: { name: string; externalCode: string } };

export default function AdminCountryImages() {
  const [cards, setCards] = useState<CountryCard[]>([]);
  const [index, setIndex] = useState(0);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [replacing, setReplacing] = useState(false);
  const card = cards[index];

  useEffect(() => {
    fetch('/api/admin/country-images')
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.error?.message ?? 'Unable to load country images.');
        setCards(data.cards);
      })
      .catch((loadError: Error) => setError(loadError.message))
      .finally(() => setLoading(false));
  }, []);

  async function findAnother() {
    if (!card) return;
    setReplacing(true);
    setError('');
    try {
      const response = await fetch('/api/admin/country-images', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ cardId: card.id }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error?.message ?? 'Unable to find another image.');
        return;
      }
      setCards((current) => current.map((item) => item.id === data.card.id ? data.card : item));
    } catch {
      setError('Unable to find another image.');
    } finally {
      setReplacing(false);
    }
  }

  if (loading) return <p>Loading country images...</p>;
  if (error && !card) return <p role="alert">{error}</p>;
  if (!card) return <><h1>Country image review</h1><p>There are no country images to review.</p></>;

  return (
    <>
      <h1>Country image review</h1>
      <p>Review one country illustration at a time. Keep the image if it is suitable, or find another one.</p>
      <p className="booster-progress">Image {index + 1} of {cards.length}</p>
      <article className="image-review-card">
        <h2>{card.country.name}</h2>
        {card.imageUrl ? <img src={card.imageUrl} alt={`${card.country.name} landscape`} /> : <p>No image available.</p>}
        <div className="booster-controls">
          <button onClick={() => setIndex((current) => current + 1)} disabled={replacing || index === cards.length - 1}>Keep image</button>
          <button onClick={findAnother} disabled={replacing}>{replacing ? 'Finding...' : 'Find another'}</button>
        </div>
      </article>
      {error && <p role="alert">{error}</p>}
    </>
  );
}
