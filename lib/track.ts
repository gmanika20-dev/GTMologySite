// Ad + analytics tracking helpers. Scripts only load after the visitor consents (see components/Consent.tsx).
export const TRACKING = {
  ga: process.env.NEXT_PUBLIC_GA_ID || 'G-26RQ1F7MMS',                       // e.g. G-XXXXXXXXXX
  meta: process.env.NEXT_PUBLIC_META_PIXEL_ID ?? '',              // e.g. 123456789012345
  linkedin: process.env.NEXT_PUBLIC_LINKEDIN_PARTNER_ID || '10211124',    // e.g. 1234567
  linkedinLeadConversion: process.env.NEXT_PUBLIC_LINKEDIN_CONVERSION_ID ?? '', // optional conversion id
};
export const trackingConfigured = () => !!(TRACKING.ga || TRACKING.meta || TRACKING.linkedin);

type W = Window & { gtag?: (...a: unknown[]) => void; fbq?: (...a: unknown[]) => void; lintrk?: (...a: unknown[]) => void };

/** Fire a conversion/event to every tool the visitor has consented to. Safe to call anytime. */
export function track(event: 'lead' | 'lab_complete' | 'book_click', params: Record<string, unknown> = {}) {
  if (typeof window === 'undefined') return;
  const w = window as W;
  if (event === 'lead') {
    w.gtag?.('event', 'generate_lead', params);
    w.fbq?.('track', 'Lead', params);
    if (TRACKING.linkedinLeadConversion) w.lintrk?.('track', { conversion_id: Number(TRACKING.linkedinLeadConversion) });
  } else {
    w.gtag?.('event', event, params);
    w.fbq?.('trackCustom', event, params);
  }
}
