import type { ReactNode } from 'react';
import '../styles.css';
import Link from 'next/link';
import { DM_Sans, Sora } from 'next/font/google';
import { currentUser } from '@/lib/auth/session';
import { SignOutButton } from '@/components/sign-out-button';
import { WorldCardsLogo } from '@/components/worldcards-logo';

const sora = Sora({
  subsets: ['latin'],
  variable: '--font-sora',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
});

export default async function Layout({ children }: { children: ReactNode }) {
  const user = await currentUser();
  return <html lang="en"><body className={`${sora.variable} ${dmSans.variable}`}><header className="topbar"><Link className="brand" href="/collection"><WorldCardsLogo /><span>World<span className="brand-muted">Cards</span></span></Link>{user && <div className="topbar-status"><span className="status-dot" />Explorer mode</div>}</header>{user ? <div className="app-shell"><aside className="side-menu"><div className="profile-chip"><span className="profile-avatar">{(user.username ?? user.email).charAt(0).toUpperCase()}</span><span><small>Signed in as</small><strong>{user.username ?? user.email}</strong></span></div><nav aria-label="Main navigation"><span className="nav-label">Explore</span><Link href="/booster"><span>✦</span>Booster</Link><Link href="/collection"><span>▦</span>Collection</Link><span className="nav-label">Account</span><Link href="/profile"><span>◉</span>Profile</Link><Link href="/settings/profile"><span>⚙</span>Settings</Link>{user.role === 'admin' && <><span className="nav-label">Admin</span><Link href="/admin/country-images"><span>◈</span>Country images</Link><Link href="/admin/capital-images"><span>◈</span>Capital images</Link></>}</nav><SignOutButton /></aside><main>{children}</main></div> : <main>{children}</main>}</body></html>;
}
