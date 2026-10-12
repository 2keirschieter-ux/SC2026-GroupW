'use client';

import { useEffect, useState } from 'react';

export default function Profile() {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/profile')
      .then(async (response) => {
        if (!response.ok) throw new Error('PROFILE_LOAD_FAILED');
        const data = await response.json();
        setUsername(data.user.username ?? '');
      })
      .catch(() => setError('Impossible de charger le profil.'));
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ username }),
    });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error?.code === 'USERNAME_TAKEN' ? 'Ce pseudo est déjà utilisé.' : data.error?.message ?? 'Impossible de sauvegarder le profil.');
      return;
    }
    setUsername(data.user.username);
    setMessage('Profil enregistré.');
  }

  return (
    <>
      <h1>Profil</h1>
      <p>Choisissez le pseudo affiché dans votre espace joueur.</p>
      <form onSubmit={save} className="profile-form">
        <label htmlFor="username">Pseudo</label>
        <input id="username" value={username} onChange={(event) => setUsername(event.target.value)} minLength={3} maxLength={24} required />
        <small>3 à 24 caractères : lettres, chiffres, espaces, tirets et underscores.</small>
        <button>Enregistrer</button>
      </form>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
