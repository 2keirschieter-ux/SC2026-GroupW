import Link from 'next/link';
import { currentUser } from '@/lib/auth/session';
import { db } from '@/lib/db/client';

export default async function Profile() {
  const user = await currentUser();
  if (!user) return <><h1>Profile</h1><p><Link href="/register">Create an account</Link> or <Link href="/sign-in">sign in</Link>.</p></>;

  const cardCount = await db.userCard.count({ where: { userId: user.id } });
  const memberSince = new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(user.createdAt);

  return (
    <>
      <h1>Profile</h1>
      <section className="profile-summary" aria-labelledby="profile-summary-title">
        <h2 id="profile-summary-title">Profile information</h2>
        <dl>
          <div><dt>Username</dt><dd>{user.username ?? 'No username set'}</dd></div>
          <div><dt>Member since</dt><dd>{memberSince}</dd></div>
          <div><dt>Cards in collection</dt><dd>{cardCount}</dd></div>
        </dl>
      </section>
      <Link className="profile-settings-link" href="/settings/profile">Edit profile information</Link>
    </>
  );
}
