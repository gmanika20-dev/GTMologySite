import type { Metadata } from 'next';
import BookForm from '@/components/BookForm';
import { Crumbs, JsonLd } from '@/components/ui';
import { breadcrumbs } from '@/lib/schema';
import { getService } from '@/lib/content';
import { SITE } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Book a Growth Strategy Call | Dominize',
  description: "Book a free 30-minute Growth Strategy Call with Manika Gupta. We'll look at your ICP, positioning, funnel and operations, and you'll leave knowing what to fix first.",
  alternates: { canonical: '/book' },
};

export default async function Book({ searchParams }: { searchParams: Promise<Record<string, string | undefined>> }) {
  const sp = await searchParams;
  const service = sp.service ? getService(sp.service) : undefined;
  return (
    <>
      <JsonLd data={breadcrumbs([{ name: 'Home', path: '/' }, { name: 'Book', path: '/book' }])} />
      <section className="svc-hero">
        <div className="wrap grid-2" style={{ alignItems: 'start' }}>
          <div className="stack">
            <h1 className="h1">Book your <em>Growth Strategy Call.</em></h1>
            {service && <p className="micro">TOPIC: {service.element.symbol} · {service.question}</p>}
          </div>
          <div><BookForm calLink={SITE.calLink || undefined} service={service?.element.name} /></div>
        </div>
      </section>
    </>
  );
}
