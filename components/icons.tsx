// Animated stroke icons. Each path "draws itself in" when its revealed parent gets the `.in` class.
// Decorative only (aria-hidden) so they never affect SEO / accessibility text.
const P: Record<string, string[]> = {
  target: ['M12 3a9 9 0 1 0 9 9', 'M12 7a5 5 0 1 0 5 5', 'M12 11a1 1 0 1 0 1 1', 'M12 12l8-8', 'M17 4h3v3'],
  megaphone: ['M3 10v4h4l7 5V5L7 10H3z', 'M17 9a4 4 0 0 1 0 6', 'M19.5 6.5a8 8 0 0 1 0 11'],
  funnel: ['M3 4h18l-7 8v6l-4 2v-8L3 4z'],
  compass: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18', 'M15.5 8.5l-2 5-5 2 2-5 5-2z'],
  clock: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18', 'M12 7v5l3 2'],
  rocket: ['M5 15c-1 1-2 4-2 6 2 0 5-1 6-2', 'M9 15l-3-3c2-6 7-9 13-9 0 6-3 11-9 13l-1-1', 'M15 9a1 1 0 1 0 0-.1'],
  chart: ['M4 20V10', 'M10 20V4', 'M16 20v-7', 'M3 20h18'],
  growth: ['M3 17l6-6 4 4 8-8', 'M15 7h6v6'],
  search: ['M11 4a7 7 0 1 0 0 14a7 7 0 1 0 0-14', 'M20 20l-4-4'],
  layers: ['M12 3l9 5-9 5-9-5 9-5z', 'M3 13l9 5 9-5', 'M3 17.5l9 5 9-5'],
  bot: ['M5 9h14v10H5z', 'M12 5v4', 'M12 4a1 1 0 1 0 0 .1', 'M9 14h.01', 'M15 14h.01', 'M2 13v3', 'M22 13v3'],
  bolt: ['M13 2L4 14h7l-1 8 9-12h-7l1-8z'],
  pen: ['M4 20h4L19 9l-4-4L4 16v4z', 'M14 6l4 4'],
  voice: ['M4 12h2', 'M8 8v8', 'M12 5v14', 'M16 8v8', 'M20 11v2'],
  globe: ['M12 3a9 9 0 1 0 0 18a9 9 0 1 0 0-18', 'M3 12h18', 'M12 3c3 3 3 15 0 18', 'M12 3c-3 3-3 15 0 18'],
  window: ['M3 5h18v14H3z', 'M3 9h18', 'M6 7h.01', 'M9 7h.01'],
  users: ['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z', 'M2 21c0-4 3-6 7-6s7 2 7 6', 'M17 11a3 3 0 1 0 0-6', 'M22 21c0-3-2-5-5-5'],
  check: ['M4 12l5 5L20 6'],
  calendar: ['M4 6h16v14H4z', 'M4 10h16', 'M9 3v5', 'M15 3v5'],
  repeat: ['M17 2l3 3-3 3', 'M4 11V9a4 4 0 0 1 4-4h12', 'M7 22l-3-3 3-3', 'M20 13v2a4 4 0 0 1-4 4H4'],
  handshake: ['M2 12l5-5 5 3 5-3 5 5', 'M7 7l-5 5 6 6 3-3', 'M17 7l5 5-6 6-3-3', 'M9 15l2 2', 'M12 12l2 2'],
  flag: ['M5 21V4', 'M5 4h12l-2 4 2 4H5'],
  spark: ['M12 3v4', 'M12 17v4', 'M3 12h4', 'M17 12h4', 'M6 6l2.5 2.5', 'M15.5 15.5L18 18', 'M18 6l-2.5 2.5', 'M8.5 15.5L6 18'],
  doc: ['M6 3h9l4 4v14H6z', 'M14 3v5h5', 'M9 13h7', 'M9 17h5'],
  shield: ['M12 3l8 3v6c0 5-4 8-8 9-4-1-8-4-8-9V6l8-3z', 'M9 12l2 2 4-4'],
};

// Map service symbols and other content to icons
export const SERVICE_ICON: Record<string, string> = { Dx: 'search', Ci: 'compass', Au: 'users', Po: 'target', Bv: 'voice', Cs: 'pen', Wo: 'window', Pa: 'chart', Ge: 'bolt', Ag: 'bot', Wb: 'globe', Pl: 'rocket', Dg: 'megaphone', Se: 'handshake', Lr: 'repeat' };

export default function Icon({ name, size = 28, className = '' }: { name: string; size?: number; className?: string }) {
  const paths = P[name] ?? P.spark;
  return (
    <svg className={`ico ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">
      {paths.map((d, i) => <path key={i} d={d} pathLength={1} style={{ transitionDelay: `${0.15 + i * 0.12}s` }} />)}
    </svg>
  );
}
