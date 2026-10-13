'use client';

import { useState } from 'react';

export function SignOutButton() {
  const [signingOut, setSigningOut] = useState(false);
  const [error, setError] = useState('');

  async function signOut() {
    setSigningOut(true);
    setError('');
    try {
      const response = await fetch('/api/auth/sign-out', { method: 'POST' });
      if (!response.ok) throw new Error('SIGN_OUT_FAILED');
      window.location.href = '/sign-in';
    } catch {
      setError('Unable to sign out. Please try again.');
      setSigningOut(false);
    }
  }

  return (
    <div className="sign-out">
      <button type="button" onClick={signOut} disabled={signingOut}>
        {signingOut ? 'Signing out...' : 'Sign out'}
      </button>
      {error && <p role="alert">{error}</p>}
    </div>
  );
}
