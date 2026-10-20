'use client';
import { useEffect, useRef, useState } from 'react';
import { ElementTile, type ElementInfo } from './ui';
import { GROUPS } from '@/lib/site';

// Chain reaction: nodes light up in sequence when scrolled into view.
export function Chain({ nodes }: { nodes: string[] }) {
  const ref = useRef<HTMLDivElement>(null);
  const [lit, setLit] = useState(-1);
  useEffect(() => {
    const el = ref.current; if (!el) return;
    let t: ReturnType<typeof setInterval>;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { let i = -1; t = setInterval(() => { i++; setLit(i); if (i >= nodes.length - 1) clearInterval(t); }, 280); io.disconnect(); }
    }, { threshold: 0.5 });
    io.observe(el);
    return () => { io.disconnect(); clearInterval(t); };
  }, [nodes.length]);
  return (
    <div className="chain" ref={ref} role="list" aria-label="How the GTM engine connects">
      {nodes.map((n, i) => (
        <span key={n} style={{ display: 'contents' }}>
          <span role="listitem" className={`node${i <= lit ? ' lit' : ''}`}>{n}</span>
          {i < nodes.length - 1 && <span className="link" aria-hidden="true">→</span>}
        </span>
      ))}
    </div>
  );
}

// Count-up numbers ("instrument readouts").
export function CountUp({ value }: { value: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [txt, setTxt] = useState(value);
  useEffect(() => {
    const m = value.match(/^([^0-9]*)([0-9.]+)(.*)$/);
    const el = ref.current;
    if (!m || !el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const [, pre, num, post] = m; const target = parseFloat(num); const dec = (num.split('.')[1] || '').length;
    setTxt(`${pre}${(0).toFixed(dec)}${post}`);
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now(); const d = 1400;
      const step = (t: number) => { const p = Math.min((t - t0) / d, 1); const v = target * (1 - Math.pow(1 - p, 3)); setTxt(`${pre}${v.toFixed(dec)}${post}`); if (p < 1) requestAnimationFrame(step); };
      requestAnimationFrame(step);
    }, { threshold: 0.6 });
    io.observe(el);
    return () => io.disconnect();
  }, [value]);
  return <span ref={ref} aria-label={value}>{txt}</span>;
}

// Periodic Table with group / formula filters.
export function PeriodicTable({ services, formulas }: { services: ElementInfo[]; formulas: { name: string; symbols: string[] }[] }) {
  const [filter, setFilter] = useState<string>('All');
  const active = (s: ElementInfo) => {
    if (filter === 'All') return true;
    if ((GROUPS as readonly string[]).includes(filter)) return s.element.group === filter;
    return formulas.find((f) => f.name === filter)?.symbols.includes(s.element.symbol) ?? true;
  };
  const opts = ['All', ...formulas.map((f) => f.name), ...GROUPS];
  return (
    <div>
      <div className="filters" role="toolbar" aria-label="Filter services">
        {opts.map((o) => <button key={o} className="chip" aria-pressed={filter === o} onClick={() => setFilter(o)}>{o}</button>)}
      </div>
      <div className="ptable">
        {services.map((s) => <ElementTile key={s.slug} s={s} dim={!active(s)} />)}
        <a href="/lab" className="el" data-tilt style={{ ['--c' as string]: 'var(--ink)', borderStyle: 'dashed' }}>
          <span className="top"><span>??</span><span>Unknown</span></span>
          <span><span className="sym" aria-hidden="true">?</span><span className="nm">Not sure which?</span><span className="q">Take the free GTM check →</span></span>
        </a>
      </div>
      <div className="legend" aria-hidden="true">
        <span><i style={{ background: 'var(--accent)' }} />Strategy &amp; Intelligence</span>
        <span><i style={{ background: 'var(--info)' }} />Growth</span>
        <span><i style={{ background: 'var(--slate)' }} />AI &amp; Engineering</span>
        <span><i style={{ background: 'var(--warn)' }} />Build</span>
      </div>
    </div>
  );
}

// Pinned scrollytelling: the section sticks while each link of the GTM chain reacts in turn.
const LINKS: [string, string][] = [
  ['Product', 'What you built, and the problem it really solves.'],
  ['Market', 'Who buys it: the ICP and buying committee most likely to win, pay and stay.'],
  ['Message', 'Why you, and why now: positioning buyers can repeat back to you.'],
  ['Demand', 'How buyers find you: content, search, AI answers and campaigns.'],
  ['Sales', 'How you win the comparison: battle cards, talk tracks and proof.'],
  ['Data', 'What is actually working: one funnel view from click to closed revenue.'],
  ['AI', 'How it scales: agents and automation that give your team its hours back.'],
];

export function ChainStory() {
  const ref = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (still) { setActive(LINKS.length - 1); return; }
    let raf = 0;
    const loop = () => {
      const el = ref.current;
      if (el) {
        const r = el.getBoundingClientRect();
        const span = r.height - innerHeight;
        const p = span > 0 ? Math.min(Math.max(-r.top / span, 0), 0.999) : 1;
        setActive(r.top > innerHeight * 0.3 ? -1 : Math.floor(p * LINKS.length));
      }
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);
  const cur = LINKS[Math.max(active, 0)];
  return (
    <div className="chain-story" ref={ref}>
      <div className="chain-sticky">
        <div className="wrap stack">
          <p className="eyebrow">How it connects</p>
          <h2 id="system" className="h2">Most consultants fix one part. Dominize connects the <em>whole growth engine.</em></h2>
          <div className="chain" role="list" aria-label="How the GTM engine connects" style={{ marginTop: 32 }}>
            {LINKS.map(([n], i) => (
              <span key={n} style={{ display: 'contents' }}>
                <span role="listitem" className={`node${i <= active ? ' lit' : ''}${i === active ? ' now' : ''}`}>{n}</span>
                {i < LINKS.length - 1 && <span className={`link${i < active ? ' on' : ''}`} aria-hidden="true">→</span>}
              </span>
            ))}
          </div>
          <div className="chain-caption" aria-live="polite">
            <span className="mono">{active >= 0 ? `0${active + 1} / 07 · ${cur[0].toUpperCase()}` : 'SCROLL TO SEE HOW IT CONNECTS'}</span>
            <p key={active}>{active >= 0 ? cur[1] : 'Each link depends on the one before it. A weak link anywhere breaks the chain.'}</p>
          </div>
          <p className="lede" style={{ maxWidth: '64ch' }}>An SEO consultant brings traffic. A performance marketer brings leads. A product marketer sharpens positioning. An AI consultant automates tasks. I look at the whole engine, from who you sell to all the way to the pipeline it produces.</p>
        </div>
      </div>
    </div>
  );
}
