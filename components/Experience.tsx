'use client';
// Client-only immersive layer: particle field, smooth scroll, reveals, cursor, magnetic buttons.
// Everything here is progressive enhancement — the page is complete without it.
import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

export default function Experience() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const wipeRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);
  const pathname = usePathname();

  // particle field + smooth scroll (once)
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let stopField: (() => void) | undefined;
    let lenis: { raf: (t: number) => void; destroy: () => void } | undefined;
    let raf = 0;
    const idle = (cb: () => void) => ('requestIdleCallback' in window ? (window as any).requestIdleCallback(cb, { timeout: 1500 }) : setTimeout(cb, 600));

    if (!reduce) {
      idle(async () => {
        const c = canvasRef.current;
        const gl = c && (c.getContext('webgl2') || c.getContext('webgl'));
        if (c && gl) {
          const { startField } = await import('./field');
          stopField = startField(c);
          c.classList.add('on');
        }
        const { default: Lenis } = await import('lenis');
        const l = new Lenis({ duration: 1.1, smoothWheel: true });
        lenis = l;
        const tick = (t: number) => { l.raf(t); raf = requestAnimationFrame(tick); };
        raf = requestAnimationFrame(tick);
      });
    }
    return () => { stopField?.(); cancelAnimationFrame(raf); lenis?.destroy(); };
  }, []);

  // reveals + magnetic buttons + header state (per route)
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // lens-wipe page transition (skipped on first load)
    const wipe = wipeRef.current;
    if (wipe && !still && !first.current) { wipe.classList.remove('go'); void wipe.offsetWidth; wipe.classList.add('go'); }
    first.current = false;
    // mono labels "type on" like an instrument readout
    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789·/→';
    const scramble = (el: HTMLElement) => {
      if (still || el.dataset.typed) return; el.dataset.typed = '1';
      const node = [...el.childNodes].find((n) => n.nodeType === 3 && n.textContent?.trim()) as Text | undefined; if (!node) return;
      const final = node.textContent ?? ''; el.setAttribute('aria-label', final.trim());
      let frame = 0; const total = 22;
      const tick = () => { frame++; const p = frame / total; node.textContent = final.split('').map((c, i) => (c === ' ' || i / final.length < p ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)])).join(''); if (frame < total) requestAnimationFrame(tick); else node.textContent = final; };
      requestAnimationFrame(tick);
      setTimeout(() => { frame = total; node.textContent = final; }, 900); // always finish, even if frames are throttled
    };
    const els = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); if ((e.target as HTMLElement).classList.contains('eyebrow')) scramble(e.target as HTMLElement); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    els.forEach((el) => io.observe(el));
    // safety net: anything already on screen is revealed even if the observer is throttled
    const safety = setTimeout(() => els.forEach((el) => { const r = el.getBoundingClientRect(); if (r.top < innerHeight && r.bottom > 0 && !el.classList.contains('in')) { el.classList.add('in'); if (el.classList.contains('eyebrow')) scramble(el); } }), 1600);

    const fine = window.matchMedia('(pointer: fine)').matches && !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mags = fine ? Array.from(document.querySelectorAll<HTMLElement>('.btn, [data-magnetic]')) : [];
    const handlers = mags.map((el) => {
      const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); const x = e.clientX - (r.left + r.width / 2), y = e.clientY - (r.top + r.height / 2); el.style.transform = `translate(${x * 0.18}px, ${y * 0.25}px)`; };
      const leave = () => { el.style.transform = ''; };
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    });

    // 3D tilt on element tiles
    const tiles = fine ? Array.from(document.querySelectorAll<HTMLElement>('.el[data-tilt]')) : [];
    const tilts = tiles.map((el) => {
      const move = (e: PointerEvent) => { const r = el.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; el.style.transform = `perspective(700px) rotateY(${x * 14}deg) rotateX(${-y * 14}deg) translateZ(6px)`; };
      const leave = () => { el.style.transform = ''; };
      el.addEventListener('pointermove', move); el.addEventListener('pointerleave', leave);
      return () => { el.removeEventListener('pointermove', move); el.removeEventListener('pointerleave', leave); };
    });
    return () => { clearTimeout(safety); io.disconnect(); handlers.forEach((h) => h()); tilts.forEach((h) => h()); };
  }, [pathname]);

  // scroll progress hairline + parallax on [data-parallax]
  useEffect(() => {
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    const loop = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      if (barRef.current) barRef.current.style.transform = `scaleX(${max > 0 ? scrollY / max : 0})`;
      if (!still) document.querySelectorAll<HTMLElement>('[data-parallax]').forEach((el) => {
        const r = el.getBoundingClientRect(); const k = parseFloat(el.dataset.parallax || '0.05');
        const img = el.querySelector('img'); if (img) img.style.transform = `translateY(${(r.top + r.height / 2 - innerHeight / 2) * -k}px) scale(1.08)`;
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => cancelAnimationFrame(raf);
  }, []);

  // custom cursor
  useEffect(() => {
    if (!window.matchMedia('(pointer: fine)').matches) return;
    const c = cursorRef.current; if (!c) return;
    let x = -100, y = -100, cx = -100, cy = -100, raf = 0;
    const move = (e: PointerEvent) => { x = e.clientX; y = e.clientY; const t = e.target as HTMLElement; c.classList.toggle('hot', !!t.closest('a, button, summary, [role="button"], input, select, textarea')); };
    const loop = () => { cx += (x - cx) * 0.2; cy += (y - cy) * 0.2; c.style.transform = `translate(${cx}px, ${cy}px)`; raf = requestAnimationFrame(loop); };
    window.addEventListener('pointermove', move, { passive: true }); loop();
    return () => { window.removeEventListener('pointermove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <>
      <canvas id="field" ref={canvasRef} aria-hidden="true" />
      <div className="atmos" aria-hidden="true" />
      <div className="grain" aria-hidden="true" />
      <div className="cursor" ref={cursorRef} aria-hidden="true" />
      <div className="scroll-bar" ref={barRef} aria-hidden="true" />
      <div className="lens-wipe" ref={wipeRef} aria-hidden="true" />
    </>
  );
}
