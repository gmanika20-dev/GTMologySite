// Dominize mark: a solid "D" (your domain) with a rising line that breaks out to a peak (leading the market).
export default function Logo({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden="true">
      <path d="M6 4h9.5C23 4 28 9.2 28 16s-5 12-12.5 12H6V4z" fill="#0F1E3D" />
      <path d="M10.5 22l5-5 3 3 6.5-6.5" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="25.6" cy="12.9" r="2.6" fill="#7A1F2B" />
    </svg>
  );
}
