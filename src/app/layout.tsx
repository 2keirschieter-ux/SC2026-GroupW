import type { ReactNode } from 'react';
import '../styles.css';
import Link from 'next/link';
import { currentUser } from '@/lib/auth/session';
import { SignOutButton } from '@/components/sign-out-button';

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  return <html lang="en"><body><header><Link href="/collection">WorldCards</Link></header>{user ? <div className="app-shell"><aside className="side-menu"><strong>{user.username ?? user.email}</strong><nav><Link href="/booster">Booster</Link><Link href="/collection">Collection</Link><Link href="/profile">Profile</Link><Link href="/settings/profile">Settings</Link>{user.role === 'admin' && <><Link href="/admin/country-images">Review country images</Link><Link href="/admin/capital-images">Review capital images</Link></>}</nav><SignOutButton /></aside><main>{children}</main></div> : <main>{children}</main>}</body></html>;
}
