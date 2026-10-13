'use client';

import { useEffect, useState } from 'react';

type ProfileData = { username: string | null; email: string };

export default function ProfileSettings() {
  const [profile, setProfile] = useState<ProfileData>({ username: '', email: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/profile')
      .then(async (response) => {
        if (!response.ok) throw new Error('PROFILE_LOAD_FAILED');
        const data = await response.json();
        setProfile({ username: data.user.username ?? '', email: data.user.email });
      })
      .catch(() => setError('Unable to load profile information.'))
      .finally(() => setLoading(false));
  }, []);

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage('');
    setError('');
    const response = await fetch('/api/profile', {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(profile),
    });
    const data = await response.json();
    if (!response.ok) {
      const messages: Record<string, string> = {
        EMAIL_TAKEN: 'This email address is already in use.',
        USERNAME_TAKEN: 'This username is already in use.',
      };
      setError(messages[data.error?.code] ?? data.error?.message ?? 'Unable to save profile information.');
      return;
    }
    setProfile({ username: data.user.username ?? '', email: data.user.email });
    setMessage('Profile information saved.');
  }

  return (
    <>
      <h1>Settings</h1>
      <section aria-labelledby="profile-settings-title">
        <h2 id="profile-settings-title">Profile information</h2>
        <p>Change your username and email address.</p>
        <form onSubmit={save} className="profile-form">
          <label htmlFor="username">Username</label>
          <input id="username" value={profile.username ?? ''} onChange={(event) => setProfile({ ...profile, username: event.target.value })} minLength={3} maxLength={24} required disabled={loading} />
          <small>3 to 24 characters: letters, numbers, spaces, hyphens, and underscores.</small>
          <label htmlFor="email">Email address</label>
          <input id="email" type="email" value={profile.email} onChange={(event) => setProfile({ ...profile, email: event.target.value })} required disabled={loading} />
          <button disabled={loading}>Save</button>
        </form>
      </section>
      {message && <p role="status">{message}</p>}
      {error && <p role="alert">{error}</p>}
    </>
  );
}
