// Renders service-page sections as visual layouts (grids, timelines, tiles) instead of long prose.
// All text comes from the markdown content files and stays in the HTML (SEO / GEO / AEO safe).
import { marked } from 'marked';
import type { Section } from '@/lib/content';
import Icon from './icons';

const inline = (s: string) => marked.parseInline(s.trim(), { async: false }) as string;
const block = (s: string) => marked.parse(s.trim(), { async: false }) as string;
const listItems = (md: string) => md.split('\n').map((l) => l.trim()).filter((l) => /^(-|\d+\.)\s/.test(l)).map((l) => l.replace(/^(-|\d+\.)\s+/, ''));
const nonList = (md: string) => md.split('\n').filter((l) => !/^\s*(-|\d+\.)\s/.test(l)).join('\n').trim();

const SYMPTOM_ICONS = ['target', 'funnel', 'compass', 'clock', 'megaphone'];
const WAY_ICONS = ['flag', 'repeat', 'handshake'];

function H({ children }: { children: React.ReactNode }) { return <h2 className="sec-title">{children}</h2>; }

export default function ServiceSections({ sections }: { sections: Section[] }) {
  const get = (t: string) => sections.find((s) => s.title.toLowerCase() === t.toLowerCase());
  const timeline = get('Timeline'), success = get('Success looks like');
  return (
    <>
      {sections.map((sec) => {
        const t = sec.title.toLowerCase();
        if (t === 'you might be seeing') {
          return (
            <section key={sec.title} className="svc-block" data-reveal>
              <H>{sec.title}</H>
              <ul className="symptom-grid">
                {listItems(sec.md).map((it, i) => (
                  <li key={it} className="card"><span className="ico-wrap sm"><Icon name={SYMPTOM_ICONS[i % SYMPTOM_ICONS.length]} size={22} /></span><span dangerouslySetInnerHTML={{ __html: inline(it) }} /></li>
                ))}
              </ul>
            </section>
          );
        }
        if (t === "what's usually happening") {
          return (
            <section key={sec.title} className="svc-block" data-reveal>
              <div className="callout">
                <span className="ico-wrap"><Icon name="spark" /></span>
                <div><H>{sec.title}</H><div className="callout-body" dangerouslySetInnerHTML={{ __html: block(sec.md) }} /></div>
              </div>
            </section>
          );
        }
        if (t === 'how we do it') {
          return (
            <section key={sec.title} className="svc-block" data-reveal>
              <H>{sec.title}</H>
              <ol className="v-timeline">
                {listItems(sec.md).map((it, i) => (
                  <li key={it} style={{ transitionDelay: `${0.1 + i * 0.12}s` }}><span className="n" aria-hidden="true">{String(i + 1).padStart(2, '0')}</span><span dangerouslySetInnerHTML={{ __html: inline(it) }} /></li>
                ))}
              </ol>
            </section>
          );
        }
        if (t === 'what you get') {
          const [first, ...rest] = sec.md.split('\n\n');
          return (
            <section key={sec.title} className="svc-block" data-reveal>
              <H>{sec.title}</H>
              <ul className="deliverables">
                {first.split(' · ').map((d) => <li key={d}><Icon name="check" size={18} /><span>{d.trim()}</span></li>)}
              </ul>
              {rest.length > 0 && <blockquote className="proof-quote" dangerouslySetInnerHTML={{ __html: block(rest.join('\n\n')) }} />}
            </section>
          );
        }
        if (t === 'timeline' || t === 'success looks like') {
          if (t === 'success looks like' && timeline) return null; // rendered together with Timeline
          return (
            <section key={sec.title} className="svc-block duo" data-reveal>
              {[timeline, success].filter(Boolean).map((x, i) => (
                <div key={x!.title} className={`card${i === 1 ? ' feature' : ''}`}>
                  <span className="ico-wrap"><Icon name={i === 0 ? 'calendar' : 'flag'} /></span>
                  <H>{x!.title}</H>
                  <div dangerouslySetInnerHTML={{ __html: block(x!.md) }} />
                </div>
              ))}
            </section>
          );
        }
        if (t === 'ways to engage') {
          const items = listItems(sec.md);
          const other = nonList(sec.md);
          return (
            <section key={sec.title} className="svc-block" data-reveal>
              <H>{sec.title}</H>
              <div className="ways-grid">
                {items.map((it, i) => {
                  const m = it.match(/^\*\*(.+?):\*\*\s*(.*)$/);
                  return (
                    <div key={it} className={`card${i === 1 ? ' feature' : ''}`}>
                      <span className="ico-wrap"><Icon name={WAY_ICONS[i % 3]} /></span>
                      <h3 className="h3">{m ? m[1] : ''}</h3>
                      <p dangerouslySetInnerHTML={{ __html: inline(m ? m[2] : it) }} />
                    </div>
                  );
                })}
              </div>
              {other && <div dangerouslySetInnerHTML={{ __html: block(other) }} />}
            </section>
          );
        }
        return (
          <section key={sec.title} className="svc-block" data-reveal>
            <H>{sec.title}</H>
            <div dangerouslySetInnerHTML={{ __html: sec.html }} />
          </section>
        );
      })}
    </>
  );
}
