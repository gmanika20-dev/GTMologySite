'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import Logo from './Logo';
import { NAV } from '@/lib/site';
import { startSound, stopSound } from './sound';

export default function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [sound, setSound] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 24);
    on(); window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, []);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; }, [open]);

  const toggleSound = () => { const on = !sound; if (on) startSound(); else stopSound(); setSound(on); window.dispatchEvent(new CustomEvent('gtm:sound', { detail: { on } })); };

  return (
    <header className={`site-header${scrolled || open ? ' scrolled' : ''}`}>
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Dominize with Manika Gupta, home"><Logo /><span className="logo-text">Dominize<small>with Manika Gupta</small></span></Link>
        <nav className="nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} aria-current={pathname.startsWith(n.href) ? 'page' : undefined}>{n.label}</Link>
          ))}
        </nav>
        <div className="header-tools">
          <button className="icon-btn" onClick={toggleSound} aria-pressed={sound} aria-label={sound ? "Turn background music off" : "Turn background music on"} title={sound ? "Music off" : "Music on"}>
            {sound ? (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M16 9a4 4 0 0 1 0 6M18.5 6.5a8 8 0 0 1 0 11" /></svg>
            ) : (
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><path d="M4 9v6h4l5 4V5L8 9H4z" /><path d="M17 9l5 6M22 9l-5 6" /></svg>
            )}
          </button>
          <Link href="/book" className="btn btn-primary btn-sm header-cta">Book a Growth Strategy Call <span className="arrow">→</span></Link>
          <button className="icon-btn menu-btn" onClick={() => setOpen(!open)} aria-expanded={open} aria-controls="mobile-menu" aria-label={open ? 'Close menu' : 'Open menu'}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">{open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 8h16M4 16h16" />}</svg>
          </button>
        </div>
      </div>
      {open && (
        <div className="mobile-menu" id="mobile-menu">
          {NAV.map((n) => <Link key={n.href} href={n.href}>{n.label}</Link>)}
          <Link href="/book" className="btn btn-primary">Book a Growth Strategy Call →</Link>
        </div>
      )}
    </header>
  );
}
