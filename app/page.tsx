import Link from 'next/link';
import { getServices, getInsights } from '@/lib/content';
import { KNOWN_FOR, FORMULAS, PRACTICES, SITE } from '@/lib/site';
import { FaqList, JsonLd, Lines } from '@/components/ui';
import { ChainStory } from '@/components/home-bits';
import { faqSchema } from '@/lib/schema';
import Icon from '@/components/icons';
import { HeroEngine, Ticker, StepsTimeline } from '@/components/visuals';

const SYMPTOMS = [
  ['Your ICP is fuzzy.', 'You sell to "mid-market companies," and so does everyone else.'],
  ["Your positioning sounds like everyone else's.", "Prospects can't tell you apart in a three-tab comparison."],
  ['Marketing creates activity, not pipeline.', "Clicks, impressions and MQLs go up, but opportunities don't."],
  ['Sales is flying blind.', 'No battle cards, no competitor intel, no clear reason to win.'],
  ['Your team is drowning in manual work.', 'Reporting, research and content ops eat the week.'],
];

const HOME_FAQS = [
  { q: 'What is Dominize Consultancy?', a: "Dominize Consultancy is an AI-enabled go-to-market (GTM) consulting firm for B2B SaaS and fintech companies, founded by Manika Gupta. It diagnoses why a company's GTM isn't producing pipeline, then fixes the system across ICP, positioning, demand generation, conversion, sales enablement and AI automation." },
  { q: 'What does a GTM consultant do?', a: 'A GTM consultant helps a company decide who to sell to, what to say, how to reach buyers and how to convert them into revenue. That covers ICP definition, positioning and messaging, launch planning, demand generation, sales enablement and measurement.' },
  { q: 'Who does Dominize work with?', a: 'B2B SaaS and fintech companies from seed stage to established enterprises, especially founders, marketing leaders and product marketing teams facing unclear ICPs, me-too positioning, weak pipeline or too much manual work. Dominize also designs and builds websites for growing businesses.' },
  { q: 'How is Dominize different from a marketing agency?', a: 'Agencies usually execute one channel. Dominize diagnoses and connects the whole GTM system, from market and message to demand, sales, data and AI, and builds the strategy, assets and automations needed to fix it.' },
  { q: 'How do I get started?', a: 'Take the free 4-minute GTM Scorecard, or book a free 30-minute Growth Strategy Call. Every engagement is scoped to your situation, and you receive a tailored proposal after the diagnostic.' },
  { q: 'Do you work with companies outside India?', a: 'Yes. Dominize is based in Gurugram, India, and works with B2B companies globally, including the US, UK, EMEA and APAC.' },
];

const SYMPTOM_ICONS = ['target', 'megaphone', 'funnel', 'compass', 'clock'];
const KNOWN_ICONS = ['globe', 'growth', 'search', 'compass'];
const POST_ICONS = ['layers', 'bot', 'users'];
const WAYS = [
  ['One-time project', 'A defined project with a clear deliverable. Best for a launch, a repositioning or a website.', 'flag'],
  ['Monthly retainer', 'Ongoing execution and optimisation, with a weekly working session.', 'repeat'],
  ['Annual contract', 'I embed as your fractional GTM lead, with priority access.', 'handshake'],
];
const STEPS = [
  { label: 'About you', icon: 'users' }, { label: 'Your challenges', icon: 'search' }, { label: 'Your results', icon: 'chart' },
  { label: 'Your plan', icon: 'layers' }, { label: 'How we’ll work', icon: 'calendar' }, { label: 'Next step', icon: 'rocket' },
];

export default function Home() {
  const all = getServices();
  const bySlug = Object.fromEntries(all.map((s) => [s.slug, s]));
  const insights = getInsights().slice(0, 3);

  return (
    <>
      <JsonLd data={faqSchema(HOME_FAQS)} />

      {/* S1 — Hero (text + 3D engine) */}
      <section className="hero hero-split">
        <div className="wrap hero-grid">
          <div className="stack">
            <h1 className="display" data-reveal>
              <Lines text={['Your product deserves', 'a better <em>GTM engine.</em>']} />
            </h1>
            <p className="lede" data-reveal>I help B2B SaaS and fintech companies turn market intelligence into positioning, demand and pipeline, and add AI where it makes the whole marketing system faster.</p>
            <p className="tags" data-reveal><span>GTM Strategy</span><span>Product Marketing</span><span>Demand Generation</span><span>AI Automation</span></p>
            <div data-reveal>
              <div className="cta-row">
                <Link href="/book" className="btn btn-primary">Book a Growth Strategy Call <span className="arrow">→</span></Link>
                <Link href="/lab" className="btn btn-ghost">Get your free GTM Scorecard</Link>
              </div>
            </div>
            <div className="scroll-hint" aria-hidden="true"><i /> Scroll to explore</div>
          </div>
          <HeroEngine />
        </div>
      </section>

      <Ticker items={[...all.map((s) => s.element.name), ...FORMULAS.map((f) => f.name)]} />

      {/* S2 — The shift */}
      <section className="section tight">
        <div className="wrap shift-split">
          <p className="shift shift-from" data-reveal><span className="lbl">From</span><span className="from">&ldquo;We have a great product.&rdquo;</span></p>
          <span className="shift-arrow" aria-hidden="true"><Icon name="growth" size={40} /></span>
          <p className="shift shift-to" data-reveal><span className="lbl">To</span><span className="to">&ldquo;We know exactly who will buy it, why they&rsquo;ll buy it and how to reach them.&rdquo;</span></p>
        </div>
      </section>

      {/* S3 — Challenges (bento grid) */}
      <section className="section" aria-labelledby="problem">
        <div className="wrap stack">
          <div className="chapter-head">
            <span className="chapter" aria-hidden="true">01</span>
            <div className="stack">
              <p className="eyebrow" data-reveal>Sound familiar?</p>
              <h2 id="problem" className="h2" data-reveal>Your product isn&rsquo;t necessarily the problem. Your <em>GTM system</em> might be.</h2>
            </div>
          </div>
          <div className="bento" style={{ marginTop: 40 }}>
            {SYMPTOMS.map(([t, d], i) => (
              <article key={t} className={`card symptom bento-${i}`} data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="ico-wrap"><Icon name={SYMPTOM_ICONS[i]} size={i === 0 ? 44 : 30} /></span>
                <h3 className="h3">{t}</h3>
                <p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* S4 — Cause → effect (pinned scrollytelling) */}
      <section className="gridlines" aria-labelledby="system">
        <ChainStory />
      </section>

      {/* S5 — Why me (cinematic navy band) */}
      <section className="section band-navy" aria-labelledby="why">
        <div className="band-orbs" aria-hidden="true"><i /><i /><i /></div>
        <div className="wrap why-grid">
          <figure className="portrait" data-reveal data-parallax="0.05">
            <img src="/media/manika-gupta.webp" alt="Manika Gupta, founder of Dominize Consultancy" width={1374} height={1145} loading="lazy" decoding="async" />
          </figure>
          <div className="stack">
            <p className="eyebrow" data-reveal>Why Dominize</p>
            <h2 id="why" className="quote" data-reveal>Strategy without execution doesn&rsquo;t create pipeline. Execution without strategy creates noise. <em>I bridge the two.</em></h2>
            <p className="lede" data-reveal>I&rsquo;ve worked across product marketing, GTM, demand generation, analytics and AI automation. Most recently that was for a global banking-technology leader serving financial institutions in the US, EMEA and APAC. So I don&rsquo;t look at marketing as separate channels. I look at the entire system, from market to pipeline. The strategy, judgement and craft are mine; AI is an added capability I bring when it genuinely helps.</p>
            <div data-reveal><Link href="/about" className="btn btn-ghost">Meet Manika <span className="arrow">→</span></Link></div>
          </div>
        </div>
      </section>

      {/* S6 — Known for (icon grid) */}
      <section className="section tight" aria-labelledby="results">
        <div className="wrap stack">
          <p className="eyebrow" data-reveal id="results">Known for</p>
          <div className="cards known icon-cards" style={{ marginTop: 8 }}>
            {KNOWN_FOR.map((k, i) => (
              <article key={k.title} className="card" data-reveal style={{ transitionDelay: `${i * 70}ms` }}>
                <span className="ico-wrap"><Icon name={KNOWN_ICONS[i]} /></span>
                <h3 className="h3">{k.title}</h3>
                <p>{k.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* S7 — Services: practice areas */}
      <section className="section" aria-labelledby="elements">
        <div className="wrap stack">
          <div className="chapter-head">
            <span className="chapter" aria-hidden="true">02</span>
            <div className="stack">
              <h2 id="elements" className="h2" data-reveal>Every lever of growth, <em>in one partner.</em></h2>
            </div>
          </div>
          <div className="practice-cards" style={{ marginTop: 32 }}>
            {PRACTICES.map((p) => (
              <article key={p.id} className="card practice-card" data-group={p.group} data-reveal>
                <span className="ico-wrap"><Icon name={p.icon} /></span>
                <h3 className="h3">{p.title}</h3>
                <p>{p.promise}</p>
                <ul>
                  {p.capabilities.map((c) => bySlug[c.slug] && <li key={c.slug + (c.name ?? '')}><Link href={`/services/${c.slug}`}>{c.name ?? bySlug[c.slug].element.name}</Link></li>)}
                </ul>
                <Link href={`/services#${p.id}`} className="go">Explore this area <span className="arrow">→</span></Link>
              </article>
            ))}
          </div>
          <div data-reveal style={{ marginTop: 24 }} className="cta-row"><Link href="/services" className="btn btn-primary">See all services <span className="arrow">→</span></Link><Link href="/lab" className="btn btn-ghost">Not sure? Get your free GTM Scorecard</Link></div>
        </div>
      </section>

      {/* S8 — How it works (animated timeline) */}
      <section className="section gridlines" aria-labelledby="method">
        <div className="wrap stack">
          <div className="chapter-head">
            <span className="chapter" aria-hidden="true">03</span>
            <div className="stack">
              <p className="eyebrow" data-reveal>How it works</p>
              <h2 id="method" className="h2" data-reveal>Get a free GTM Scorecard in 4 minutes. <em>Leave with a plan.</em></h2>
            </div>
          </div>
          <StepsTimeline steps={STEPS} />
          <div className="cta-row" data-reveal style={{ marginTop: 32 }}>
            <Link href="/lab" className="btn btn-primary">Get your free GTM Scorecard <span className="arrow">→</span></Link>
          </div>
        </div>
      </section>

      {/* S9 — Ways to work */}
      <section className="section" aria-labelledby="ways">
        <div className="wrap stack">
          <h2 id="ways" className="h2" data-reveal>Start with one project, or bring a <em>senior GTM lead</em> onto your team.</h2>
          <div className="cards c3 ways" style={{ marginTop: 32 }}>
            {WAYS.map(([t, d, ic], i) => (
              <article key={t} className={`card${i === 1 ? ' feature' : ''}`} data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
                <span className="ico-wrap"><Icon name={ic} /></span>
                <h3 className="h3">{t}</h3><p>{d}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* S10 — Insights */}
      <section className="section tight" aria-labelledby="notes">
        <div className="wrap stack">
          <p className="eyebrow" data-reveal>Insights</p>
          <h2 id="notes" className="h2" data-reveal>Research, frameworks and <em>field notes.</em></h2>
          <div className="post-list" style={{ marginTop: 32 }}>
            {insights.map((p, i) => (
              <Link key={p.slug} href={`/insights/${p.slug}`} className="card post-card with-cover" data-reveal>
                <span className={`post-cover c${i}`} aria-hidden="true"><Icon name={POST_ICONS[i % 3]} size={40} /></span>
                <span><span className="meta"><span>{p.type}</span><span>{p.readTime}</span></span><h3>{p.title}</h3></span>
                <span className="muted" style={{ fontSize: 14 }}>Read the note →</span>
              </Link>
            ))}
          </div>
          <div data-reveal><Link href="/insights" className="btn btn-ghost">All insights <span className="arrow">→</span></Link></div>
        </div>
      </section>

      {/* S10b — FAQ */}
      <section className="section tight" aria-labelledby="faq">
        <div className="wrap grid-2">
          <div className="stack"><p className="eyebrow" data-reveal>Questions</p><h2 id="faq" className="h2" data-reveal>Frequently asked <em>questions</em></h2></div>
          <div data-reveal><FaqList faqs={HOME_FAQS} /></div>
        </div>
      </section>

      {/* S11 — Final CTA (cinematic banner) */}
      <section className="section band-navy cta-banner">
        <div className="band-orbs" aria-hidden="true"><i /><i /><i /></div>
        <div className="banner-rings" aria-hidden="true"><i /><i /><i /></div>
        <div className="wrap stack" style={{ textAlign: 'center', display: 'grid', justifyItems: 'center', position: 'relative' }}>
          <h2 className="h1" data-reveal style={{ maxWidth: '18ch' }}>Let&rsquo;s find out what&rsquo;s really breaking your <em>pipeline.</em></h2>
          <p className="lede" data-reveal>A free 30-minute Growth Strategy Call. You&rsquo;ll leave with clarity, even if we never work together.</p>
          <div className="cta-row" data-reveal style={{ justifyContent: 'center' }}>
            <Link href="/book" className="btn btn-primary">Book a Growth Strategy Call <span className="arrow">→</span></Link>
            <Link href="/lab" className="btn btn-ghost">or get your free GTM Scorecard first</Link>
          </div>
        </div>
      </section>
    </>
  );
}
