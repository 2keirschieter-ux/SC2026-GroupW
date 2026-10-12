import type { ReactNode } from 'react';
import '../styles.css';
import Link from 'next/link';
import { currentUser } from '@/lib/auth/session';

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  return <html lang="en"><body><header><Link href="/collection">WorldCards</Link></header>{user ? <div className="app-shell"><aside className="side-menu"><strong>{user.username ?? user.email}</strong><nav><Link href="/booster">Booster</Link><Link href="/collection">Collection</Link><Link href="/profile">Profil</Link></nav></aside><main>{children}</main></div> : <main>{children}</main>}</body></html>;
}
