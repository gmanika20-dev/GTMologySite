# GTMology — gtmologyai.com

Next.js 16 site for GTMology: the immersive "GTMology Lab" diagnostic, 11 service pages, Lab Notes, booking, and a pre-filled contract PDF. Built to the Step 1 planning documents and Step 2 content standard (SEO · GEO · AEO · AAO).

## Editing content (the "backend")
| To change… | Edit |
|---|---|
| A service page (copy, FAQs, At a glance, takeaways) | `content/services/NN-<slug>.md` |
| An article / add a new one | `content/insights/*.md` (copy an existing file's frontmatter) |
| Lab questions, answers, insights, weights, protocol | `content/lab.ts` |
| Proof numbers, nav, formulas, site facts | `lib/site.ts` |
| Homepage copy | `app/page.tsx` |
| Colours, fonts, spacing | `app/globals.css` (tokens at the top) |

No prices anywhere on the site, by design.

## Run locally
```
npm install
npm run build
npm run start        # http://localhost:3000
```
(or `node scripts/serve.js` from any folder)

## Environment variables
Copy `.env.example` → `.env.local` (and add the same in Vercel). Everything is optional — without keys the site still works:
- no Supabase → Lab sessions & bookings saved to `.data/*.jsonl` in dev (not persisted in production)
- no Resend → emails are logged, not sent
- no Cal.com link → the built-in booking-request form is used

## Backend pieces
- `app/api/lab` — saves Lab sessions; emails the diagnosis on request
- `app/api/book` — booking request → saves lead + booking, sends thank-you to the client and an alert to Manika
- `app/api/contract` — generates the pre-filled agreement PDF (draft — legal review required)
- `app/api/webhooks/cal` — Cal.com BOOKING_CREATED → store + thank-you email
- `supabase/schema.sql` — run once in Supabase SQL Editor

## Search & AI visibility (built in)
Server-rendered HTML · per-page titles/descriptions/canonicals · JSON-LD (Organization, Person, Service, FAQPage, BlogPosting, HowTo, WebApplication, BreadcrumbList, ReserveAction) · `sitemap.xml` · `robots.txt` (AI crawlers allowed) · `llms.txt` · `llms-full.txt` · `services.json` · text-mode Lab at `/lab?mode=text` · deep-link booking `/book?service=<slug>`.

## Immersive layer (progressive enhancement)
`components/field.ts` (Three.js particle field — clusters into the 6 GTM systems during diagnosis) · `components/Experience.tsx` (Lenis smooth scroll, reveals, cursor, magnetic buttons, tile tilt) · `components/sound.ts` (generative ambient sound, off by default). All disabled for `prefers-reduced-motion`.
