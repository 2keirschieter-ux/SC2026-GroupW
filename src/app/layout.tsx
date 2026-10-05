import type { ReactNode } from 'react';
import '../styles.css';
export default function Layout({ children }: { children: ReactNode }) { return <html lang="en"><body><header><a href="/collection">WorldCards</a><nav><a href="/booster">Booster</a> <a href="/collection">Collection</a></nav></header><main>{children}</main></body></html>; }
