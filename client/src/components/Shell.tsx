import { Link } from 'react-router-dom';
import { ArrowUpRight, Fingerprint } from 'lucide-react';
import type { ReactNode } from 'react';

export function Shell({ children }: { children: ReactNode }) {
  return <div className="min-h-screen bg-ink text-paper">
    <header className="site-header"><div className="page-wrap flex h-full items-center justify-between">
      <Link to="/" className="brand" aria-label="AI Mystery Room home"><span className="brand-mark"><Fingerprint size={20} /></span><span>CASE<span className="text-amber">ROOM</span></span></Link>
      <nav className="flex items-center gap-6" aria-label="Main navigation"><Link className="nav-link hidden sm:inline" to="/">The archive</Link><Link className="button button-small" to="/create">New investigation <ArrowUpRight size={15} /></Link></nav>
    </div></header>
    <main>{children}</main>
    <footer className="site-footer"><div className="page-wrap flex flex-col justify-between gap-3 sm:flex-row"><p>FICTIONAL CASES. REAL DEDUCTION.</p><p>AI Mystery Room <span className="text-line">/</span> An independent case archive</p></div></footer>
  </div>;
}

export function Eyebrow({ children }: { children: ReactNode }) { return <div className="eyebrow"><span className="eyebrow-dot" />{children}</div>; }
export function PanelTitle({ index, children }: { index: string; children: ReactNode }) { return <div className="panel-title"><span>{index}</span><h2>{children}</h2></div>; }

