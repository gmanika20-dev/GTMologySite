'use client';
// Decorative, client-only visuals (3D hero object, ticker banner, scroll timeline). All aria-hidden or progressive.
import { useEffect, useRef, useState } from 'react';
import Icon from './icons';

export function HeroEngine() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    let stop: (() => void) | undefined;
    const t = setTimeout(async () => {
      const c = ref.current; if (!c || !(c.getContext('webgl2') || c.getContext('webgl'))) return;
      const { startEngine } = await import('./hero3d');
      stop = startEngine(c); setOn(true);
    }, 300);
    return () => { clearTimeout(t); stop?.(); };
  }, []);
  return (
    <div className={`hero-engine${on ? ' on' : ''}`} aria-hidden="true">
      <div className="engine-glow" />
      <canvas ref={ref} />
      <span className="engine-tag t1">ICP</span><span className="engine-tag t2">Positioning</span><span className="engine-tag t3">Demand</span>
      <span className="engine-tag t4">Conversion</span><span className="engine-tag t5">Sales</span><span className="engine-tag t6">AI</span>
    </div>
  );
}

export function Ticker({ items }: { items: string[] }) {
  const row = [...items, ...items];
  return (
    <div className="ticker" aria-hidden="true">
      <div className="ticker-track">{row.map((t, i) => <span key={i}><i>✦</i>{t}</span>)}</div>
    </div>
  );
}

/** Horizontal animated timeline; the line fills as the section scrolls through the viewport. */
export function StepsTimeline({ steps }: { steps: { label: string; icon: string }[] }) {
  const ref = useRef<HTMLOListElement>(null);
  const [p, setP] = useState(0);
  useEffect(() => {
    let raf = 0;
    const loop = () => {
      const el = ref.current;
      if (el) { const r = el.getBoundingClientRect(); const v = 1 - (r.top - innerHeight * 0.25) / (innerHeight * 0.6); setP(Math.max(0, Math.min(1, v))); }
      raf = requestAnimationFrame(loop);
    };
    loop(); return () => cancelAnimationFrame(raf);
  }, []);
  const active = Math.round(p * (steps.length - 1));
  return (
    <ol className="steps-tl" ref={ref} style={{ ['--p' as string]: p }}>
      {steps.map((s, i) => (
        <li key={s.label} className={i <= active && p > 0.02 ? 'on' : ''}>
          <span className="dot"><Icon name={s.icon} size={22} /></span>
          <b>0{i + 1}</b>
          <span>{s.label}</span>
        </li>
      ))}
    </ol>
  );
}
