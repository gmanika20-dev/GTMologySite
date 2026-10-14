'use client';
// Fires the "lead" conversion once when the thank-you page is shown (site form or Cal.com redirect).
import { useEffect } from 'react';
import { track } from '@/lib/track';

export default function TrackLead({ source }: { source: string }) {
  useEffect(() => {
    const t = setTimeout(() => track('lead', { source }), 1200); // give consented scripts a moment to load
    return () => clearTimeout(t);
  }, [source]);
  return null;
}
