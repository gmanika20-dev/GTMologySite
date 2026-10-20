'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { QUESTIONS, INTAKE, SYSTEMS, FOLLOW_UPS, MATERIALS, COMMS, TIMELINE, type SystemCode } from '@/content/lab';
import { score, band, followUpsFor, buildFormulas, type Tier } from '@/lib/lab-engine';
import { blip } from './sound';
import { track } from '@/lib/track';
import BookForm from './BookForm';

type ElMap = Record<string, { name: string; slug: string; question: string }>;
type Intake = { name: string; company: string; website: string; role: string; stage: string; industry: string; team: string };
const STAGES = ['About you', 'Your challenges', 'Your results', 'Your plan', 'How we’ll work', 'Next step'];
const MODELS = ['One-time project', 'Monthly retainer', 'Annual contract'];
const KEY = 'gtm-lab-v1';
const PHOTO = '/media/manika-gupta.webp';
const Avatar = () => <span className="avatar photo" role="img" aria-label="Manika Gupta" style={{ backgroundImage: `url(${PHOTO})` }} />;

export default function LabApp({ elements, calLink, from }: { elements: ElMap; calLink?: string; from?: string }) {
  const [stage, setStage] = useState(0);
  const [step, setStep] = useState(0); // sub-step within a stage
  const [intake, setIntake] = useState<Intake>({ name: '', company: '', website: '', role: '', stage: '', industry: '', team: '' });
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [fu, setFu] = useState<Record<string, string>>({});
  const [tier, setTier] = useState<Tier>('compound');
  const [picked, setPicked] = useState<string[] | null>(null);
  const [model, setModel] = useState<string | null>(null);
  const [email, setEmail] = useState('');
  const [emailState, setEmailState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [sessionId] = useState(() => (typeof crypto !== 'undefined' && 'randomUUID' in crypto ? crypto.randomUUID() : undefined));
  const [decision, setDecision] = useState<'yes' | 'later' | null>(null);
  const [restored, setRestored] = useState(false);
  const topRef = useRef<HTMLDivElement>(null);

  // ---------- autosave / resume ----------
  useEffect(() => {
    try { const s = JSON.parse(localStorage.getItem(KEY) || 'null'); if (s && s.stage > 0 && s.stage < 5) { setIntake(s.intake); setAnswers(s.answers); setFu(s.fu ?? {}); setStage(s.stage); setStep(s.step ?? 0); setRestored(true); } } catch {}
  }, []);
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify({ stage, step, intake, answers, fu })); } catch {} }, [stage, step, intake, answers, fu]);

  const result = useMemo(() => score(answers), [answers]);
  const fuSystems = useMemo(() => followUpsFor(result.scores), [result.scores]);
  const fuElements = useMemo(() => fuSystems.flatMap((c) => FOLLOW_UPS[c].options.find((o) => o.label === fu[c])?.elements ?? []), [fuSystems, fu]);
  const formulas = useMemo(() => buildFormulas(result, fuElements), [result, fuElements]);
  const current = formulas[tier];
  const chosen = picked ?? current.elements;
  const chosenModel = model ?? current.model;

  // particle field clusters into the six systems during diagnosis
  useEffect(() => { window.dispatchEvent(new CustomEvent('gtm:field', { detail: { cluster: stage >= 2 } })); return () => { window.dispatchEvent(new CustomEvent('gtm:field', { detail: { cluster: false } })); }; }, [stage]);

  const go = useCallback((s: number, sub = 0) => { setStage(s); setStep(sub); requestAnimationFrame(() => topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })); }, []);
  const name = intake.name.trim().split(' ')[0] || 'there';

  // observation flow: 10 core questions, then follow-ups
  const obsTotal = QUESTIONS.length + fuSystems.length;
  const q = stage === 1 && step < QUESTIONS.length ? QUESTIONS[step] : null;
  const fq = stage === 1 && step >= QUESTIONS.length ? fuSystems[step - QUESTIONS.length] : null;
  const selected = q ? q.options.find((o) => o.id === answers[q.id]) : null;

  const pick = (qid: string, oid: string) => { setAnswers((a) => ({ ...a, [qid]: oid })); blip(); };
  const nextObs = () => { if (step + 1 < obsTotal) setStep(step + 1); else { go(2); } };
  const prevObs = () => { if (step > 0) setStep(step - 1); else go(0, 1); };

  // keyboard shortcuts A–D during observation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (stage !== 1 || (e.target as HTMLElement)?.tagName === 'INPUT') return;
      const k = e.key.toUpperCase();
      if (q && ['A', 'B', 'C', 'D'].includes(k)) pick(q.id, k);
      if (e.key === 'Enter' && (selected || (fq && fu[fq]))) nextObs();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const diagPayload = () => ({
    sessionId, intake, answers, followUps: fu, scores: Object.fromEntries(Object.entries(result.scores).map(([k, v]) => [SYSTEMS[k as SystemCode].name, v])),
    primary: SYSTEMS[result.primary].name, formula: { tier, name: current.name, elements: chosen, model: chosenModel }, source: from ?? 'lab',
  });

  const sendCopy = async () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) { setEmailState('error'); return; }
    setEmailState('sending');
    const r = await fetch('/api/lab', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'email', email, consent: true, ...diagPayload() }) }).catch(() => null);
    setEmailState(r?.ok ? 'sent' : 'error');
    if (r?.ok) track('lead', { source: 'gtm-check-email' });
  };

  const saveComplete = () => {
    track('lab_complete', { primary: SYSTEMS[result.primary].name }); fetch('/api/lab', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action: 'complete', ...(email ? { email } : {}), ...diagPayload() }) }).catch(() => {}); };

  const downloadContract = async () => {
    const r = await fetch('/api/contract', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name: intake.name, company: intake.company, role: intake.role, email, formula: { name: current.name, elements: chosen, model: chosenModel, length: current.length } }) });
    if (!r.ok) return;
    const blob = await r.blob(); const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = `Dominize-Agreement-${(intake.company || 'draft').replace(/\W+/g, '-')}.pdf`; a.click(); URL.revokeObjectURL(a.href);
  };

  const reset = () => { try { localStorage.removeItem(KEY); } catch {} setAnswers({}); setFu({}); setPicked(null); setModel(null); setTier('compound'); setDecision(null); setRestored(false); go(0); };
  const elName = (s: string) => (s === 'Dx' ? 'GTM Diagnosis' : elements[s]?.name ?? s);

  return (
    <div className="lab" ref={topRef}>
      <div className="wrap">
        <div className="lab-top">
          <span className="stage-label">Stage 0{stage + 1} · {STAGES[stage]}</span>
          <div className="progress" aria-hidden="true">{STAGES.map((s, i) => <span key={s} className={i < stage ? 'done' : i === stage ? 'cur' : ''} />)}</div>
          
          <Link href="/book" className="linkbtn">Skip to booking →</Link>
        </div>
        <div aria-live="polite" className="sr-only">Stage {stage + 1} of 6: {STAGES[stage]}</div>

        {restored && stage > 0 && (
          <p className="micro" style={{ marginBottom: 20 }}>Welcome back. I saved your progress. <button className="linkbtn" onClick={reset}>Start over</button></p>
        )}

        {/* ---------------- 01 INTAKE ---------------- */}
        {stage === 0 && step === 0 && (
          <section>
            <div className="host"><Avatar /><p className="bubble">Hi, I&rsquo;m Manika. Thanks for stopping by. In about four minutes we&rsquo;ll find out what&rsquo;s <em>really</em> slowing your go-to-market.</p></div>
            <form className="form-grid two" style={{ maxWidth: 760 }} onSubmit={(e) => { e.preventDefault(); setStep(1); }}>
              <div className="field"><label htmlFor="li-name">Your first name</label><input id="li-name" required autoComplete="given-name" value={intake.name} onChange={(e) => setIntake({ ...intake, name: e.target.value })} /></div>
              <div className="field"><label htmlFor="li-co">Company</label><input id="li-co" required autoComplete="organization" value={intake.company} onChange={(e) => setIntake({ ...intake, company: e.target.value })} /></div>
              <div className="field" style={{ gridColumn: '1 / -1' }}><label htmlFor="li-web">Company website (optional)</label><input id="li-web" inputMode="url" autoComplete="url" placeholder="example.com" value={intake.website} onChange={(e) => setIntake({ ...intake, website: e.target.value })} /></div>
              <div className="lab-nav" style={{ gridColumn: '1 / -1' }}><button className="btn btn-primary" type="submit">Start my free check <span className="arrow">→</span></button></div>
            </form>
          </section>
        )}
        {stage === 0 && step === 1 && (
          <section>
            <div className="host"><Avatar /><p className="bubble">Nice to meet you, {name}. A little context about <em>{intake.company || 'your company'}</em>.</p></div>
            {([['Your role', 'role', INTAKE.roles], ['Company stage', 'stage', INTAKE.stages], ['Industry', 'industry', INTAKE.industries], ['Marketing team size', 'team', INTAKE.teamSizes]] as const).map(([label, key, opts]) => (
              <fieldset key={key} style={{ border: 0, padding: 0, margin: '0 0 22px' }}>
                <legend className="eyebrow" style={{ marginBottom: 10 }}>{label}</legend>
                <div className="chips-row">{opts.map((o) => <button type="button" key={o} className="chip" aria-pressed={intake[key] === o} onClick={() => { setIntake({ ...intake, [key]: o }); blip(); }}>{o}</button>)}</div>
              </fieldset>
            ))}
            <p className="mono muted" style={{ fontSize: 12, letterSpacing: '.1em' }}>PROFILE #{(sessionId ?? '0000').slice(0, 4).toUpperCase()} · {(intake.company || 'UNKNOWN').toUpperCase()} · {(intake.stage || '—').toUpperCase()} · {(intake.industry || '—').toUpperCase()}</p>
            <div className="lab-nav"><button className="btn btn-primary" onClick={() => go(1)}>Continue <span className="arrow">→</span></button><button className="linkbtn" onClick={() => setStep(0)}>Back</button></div>
          </section>
        )}

        {/* ---------------- 02 OBSERVATION ---------------- */}
        {stage === 1 && q && (
          <section key={q.id}>
            <p className="micro" style={{ marginBottom: 14 }}>QUESTION {step + 1} / {QUESTIONS.length}{step === 0 ? ' · Pick what\'s closest to the truth, not what sounds best.' : ''}</p>
            <div className="host"><Avatar /><h2 className="bubble" id={`q-${q.id}`}>{q.text}</h2></div>
            <div className="opts" role="group" aria-labelledby={`q-${q.id}`}>
              {q.options.map((o) => (
                <button key={o.id} className="opt" aria-pressed={answers[q.id] === o.id} onClick={() => pick(q.id, o.id)}><span>{o.label}</span><kbd>{o.id}</kbd></button>
              ))}
            </div>
            {selected && <p className="insight" role="status"><small>WHAT THIS USUALLY MEANS</small>{selected.insight}</p>}
            <div className="lab-nav">
              <button className="btn btn-primary" disabled={!selected} onClick={nextObs} style={{ opacity: selected ? 1 : 0.4 }}>{step + 1 === obsTotal ? 'See my diagnosis' : 'Next'} <span className="arrow">→</span></button>
              <button className="linkbtn" onClick={prevObs}>Back</button>
            </div>
          </section>
        )}
        {stage === 1 && fq && (
          <section key={fq}>
            <p className="micro" style={{ marginBottom: 14 }}>A LITTLE MORE DETAIL · {SYSTEMS[fq].name.toUpperCase()}</p>
            <div className="host"><Avatar /><h2 className="bubble" id={`fq-${fq}`}>Let’s dig a little deeper: {FOLLOW_UPS[fq].text}</h2></div>
            <div className="opts" role="group" aria-labelledby={`fq-${fq}`}>
              {FOLLOW_UPS[fq].options.map((o) => <button key={o.label} className="opt" aria-pressed={fu[fq] === o.label} onClick={() => { setFu({ ...fu, [fq]: o.label }); blip(); }}><span>{o.label}</span></button>)}
            </div>
            <div className="lab-nav"><button className="btn btn-primary" disabled={!fu[fq]} style={{ opacity: fu[fq] ? 1 : 0.4 }} onClick={nextObs}>{step + 1 === obsTotal ? 'See my diagnosis' : 'Next'} <span className="arrow">→</span></button><button className="linkbtn" onClick={prevObs}>Back</button></div>
          </section>
        )}

        {/* ---------------- 03 DIAGNOSIS ---------------- */}
        {stage === 2 && (
          <section>
            <div className="host"><Avatar /><h2 className="bubble">Here&rsquo;s what I&rsquo;m seeing, {name}.</h2></div>
            <div className="readouts">
              {result.ranked.map((c) => (
                <div key={c} className={`readout${c === result.primary ? ' primary' : ''}`}>
                  <div className="row"><span>{SYSTEMS[c].name}</span><span>{result.scores[c]}</span></div>
                  <div className="bar"><i style={{ width: `${result.scores[c]}%`, background: result.scores[c] >= 70 ? 'var(--critical)' : result.scores[c] >= 40 ? 'var(--warn)' : 'var(--info)' }} /></div>
                  <div className="bandtxt">{band(result.scores[c]).toUpperCase()}{c === result.primary ? ' · BIGGEST BOTTLENECK' : ''}</div>
                </div>
              ))}
            </div>
            <article className="card" style={{ marginTop: 18, maxWidth: 860, borderColor: 'var(--critical)' }}>
              <span className="num">PRIMARY ISSUE</span>
              <h3 className="h3">{SYSTEMS[result.primary].name} is your biggest bottleneck.</h3>
              <p style={{ marginTop: 8 }}>{SYSTEMS[result.primary].cause}</p>
              <p style={{ marginTop: 12, color: 'var(--ink)' }}>My take: {intake.company || 'Your company'} is {intake.stage ? `at the ${intake.stage} stage` : 'growing'}, and your answers point to <b>{SYSTEMS[result.primary].name.toLowerCase()}</b> as the constraint{result.ranked[1] && result.scores[result.ranked[1]] >= 40 ? <>, with <b>{SYSTEMS[result.ranked[1]].name.toLowerCase()}</b> close behind</> : null}. Fix this, and everything downstream gets easier. Adding channels before fixing it mostly adds cost.</p>
            </article>
            <div className="card" style={{ marginTop: 14, maxWidth: 860 }}>
              <span className="num">OPTIONAL</span>
              <p style={{ marginTop: 8 }}>Want a copy of your diagnosis to share with your team?</p>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginTop: 12, alignItems: 'end' }}>
                <div className="field" style={{ flex: '1 1 240px' }}><label htmlFor="lab-email">Work email</label><input id="lab-email" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailState('idle'); }} /></div>
                <button className="btn btn-ghost btn-sm" onClick={sendCopy} disabled={emailState === 'sending' || emailState === 'sent'}>{emailState === 'sent' ? 'Sent ✓' : emailState === 'sending' ? 'Sending…' : 'Email me my results'}</button>
              </div>
              {emailState === 'error' && <p className="err" role="alert">Please check the email address and try again.</p>}
            </div>
            <div className="lab-nav"><button className="btn btn-primary" onClick={() => go(3)}>Show me the plan <span className="arrow">→</span></button><button className="linkbtn" onClick={() => go(1, obsTotal - 1)}>Back</button></div>
          </section>
        )}

        {/* ---------------- 04 FORMULA ---------------- */}
        {stage === 3 && (
          <section>
            <div className="host"><Avatar /><h2 className="bubble">There&rsquo;s more than one way to fix this. I&rsquo;ve marked the plan I&rsquo;d <em>recommend.</em></h2></div>
            <div className="tiers" role="radiogroup" aria-label="Choose a plan">
              {(['catalyst', 'compound', 'full'] as Tier[]).map((t) => {
                const f = formulas[t];
                return (
                  <button key={t} role="radio" aria-checked={tier === t} aria-pressed={tier === t} className={`card tier${t === 'compound' ? ' rec' : ''}`} onClick={() => { setTier(t); setPicked(null); setModel(null); blip(); }}>
                    <span className="tag">{f.tagline}</span>
                    <h3>{f.name}</h3>
                    <p>{f.elements.map(elName).join(' + ')}</p>
                    <p className="micro" style={{ marginTop: 10 }}>{f.model} · {f.length}</p>
                  </button>
                );
              })}
            </div>
            <div className="card" style={{ marginTop: 14 }}>
              <span className="num">ADJUST YOUR PLAN</span>
              <p style={{ marginTop: 8 }}>Add or remove services:</p>
              <div className="chips-row" style={{ marginTop: 10 }}>
                {['Dx', ...Object.keys(elements).filter((k) => k !== 'Dx')].map((s) => (
                  <button key={s} className="toggle-el" aria-pressed={chosen.includes(s)} title={elName(s)} aria-label={elName(s)} onClick={() => { setPicked(chosen.includes(s) ? chosen.filter((x) => x !== s) : [...chosen, s]); blip(); }}>{s}</button>
                ))}
              </div>
              <p style={{ marginTop: 14 }}>Engagement model:</p>
              <div className="seg" role="group" aria-label="Engagement model" style={{ marginTop: 8 }}>{MODELS.map((m) => <button key={m} aria-pressed={chosenModel === m} onClick={() => setModel(m)}>{m}</button>)}</div>
              <p className="micro" style={{ marginTop: 16 }}>YOUR PLAN: {chosen.map(elName).join(' + ') || '—'} · {chosenModel}. Scope and investment are tailored on the call.</p>
            </div>
            <div className="lab-nav"><button className="btn btn-primary" disabled={!chosen.length} onClick={() => go(4)}>Use this plan <span className="arrow">→</span></button><button className="linkbtn" onClick={() => go(2)}>Back</button></div>
          </section>
        )}

        {/* ---------------- 05 PROTOCOL ---------------- */}
        {stage === 4 && (
          <section>
            <div className="host"><Avatar /><h2 className="bubble">Here&rsquo;s exactly how we&rsquo;d work together: what I&rsquo;ll need, what happens each week, and what <em>success</em> looks like.</h2></div>
            <div className="protocol">
              <article className="card"><span className="num">01 · MATERIALS I&rsquo;LL NEED</span>
                <ul className="check" style={{ marginTop: 12 }}>{[MATERIALS.always, ...[...new Set(chosen)].map((e) => MATERIALS[e]).filter(Boolean)].map((m) => <li key={m}>{m}</li>)}</ul></article>
              <article className="card"><span className="num">02 · TIMELINE</span>
                <ul className="timeline" style={{ marginTop: 8 }}>{TIMELINE.map((t) => <li key={t.week}><b>{t.week}</b><span><strong>{t.phase}</strong><br /><span className="muted">{t.see}</span></span></li>)}</ul></article>
              <article className="card"><span className="num">03 · HOW WE COMMUNICATE</span>
                <ul className="check" style={{ marginTop: 12 }}>{COMMS.map((c) => <li key={c}>{c}</li>)}</ul></article>
              <article className="card"><span className="num">04 · HOW I BECOME PART OF YOUR TEAM</span>
                <p style={{ marginTop: 12 }}>I join your tools, attend relevant meetings, and work alongside marketing and sales, not as an outside agency that disappears between reports.</p>
                <p style={{ marginTop: 12 }}><b style={{ color: 'var(--ink)' }}>How you can help me help you:</b> one decision-maker with 2 hours a week, fast access to data and people, and honest feedback on drafts.</p></article>
              <article className="card" style={{ gridColumn: '1 / -1', borderColor: 'var(--accent)' }}><span className="num">05 · WHAT SUCCESS LOOKS LIKE</span>
                <ul className="check" style={{ marginTop: 12 }}>{[result.primary, ...result.ranked.slice(1, 3).filter((c) => result.scores[c] >= 40)].map((c) => <li key={c}><b style={{ color: 'var(--ink)' }}>{SYSTEMS[c].name}:</b> {SYSTEMS[c].success}</li>)}</ul></article>
            </div>
            <div className="lab-nav"><button className="btn btn-primary" onClick={() => { saveComplete(); go(5); }}>Continue <span className="arrow">→</span></button><button className="linkbtn" onClick={() => go(3)}>Back</button></div>
          </section>
        )}

        {/* ---------------- 06 APPROVAL ---------------- */}
        {stage === 5 && (
          <section>
            {!decision && (
              <>
                <div className="host"><Avatar /><h2 className="bubble">So, {name}. Shall we <em>fix this together?</em></h2></div>
                <div className="cta-row">
                  <button className="btn btn-primary" onClick={() => setDecision('yes')}>Yes, let&rsquo;s fix it <span className="arrow">→</span></button>
                  <button className="btn btn-ghost" onClick={() => setDecision('later')}>Not yet</button>
                </div>
              </>
            )}
            {decision === 'yes' && (
              <div className="grid-2" style={{ alignItems: 'start' }}>
                <div className="stack">
                  <div className="host"><Avatar /><p className="bubble" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>Wonderful. Pick a time for your Growth Strategy Call. Your results are attached.</p></div>
                  <article className="card">
                    <span className="num">YOUR CONTRACT IS READY</span>
                    <p style={{ marginTop: 8 }}>I&rsquo;ve prepared a draft agreement pre-filled with your plan ({chosen.map(elName).join(' + ')}, {chosenModel}). Download it, review it, and we&rsquo;ll finalise scope together on the call. Then sign and email it back, and we take it from there.</p>
                    <button className="btn btn-ghost btn-sm" style={{ marginTop: 14 }} onClick={downloadContract}>Download contract (PDF) ↓</button>
                  </article>
                </div>
                <BookForm calLink={calLink} sessionId={sessionId} prefill={{ name: intake.name, email, company: intake.company, website: intake.website, role: intake.role }} diagnosis={{ primary: SYSTEMS[result.primary].name, scores: diagPayload().scores, formula: { name: current.name, elements: chosen, model: chosenModel } }} />
              </div>
            )}
            {decision === 'later' && (
              <div style={{ maxWidth: 680 }}>
                <div className="host"><Avatar /><p className="bubble" style={{ fontSize: 'clamp(24px,3vw,36px)' }}>No problem. I&rsquo;ll email you your diagnosis so you can share it with your team.</p></div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'end' }}>
                  <div className="field" style={{ flex: '1 1 260px' }}><label htmlFor="lab-email2">Work email</label><input id="lab-email2" type="email" autoComplete="email" value={email} onChange={(e) => { setEmail(e.target.value); setEmailState('idle'); }} /></div>
                  <button className="btn btn-primary btn-sm" onClick={sendCopy} disabled={emailState === 'sending' || emailState === 'sent'}>{emailState === 'sent' ? 'Sent ✓' : 'Send my diagnosis'}</button>
                </div>
                {emailState === 'sent' && <p className="ok" role="status" style={{ marginTop: 12 }}>Sent. Check your inbox. When you&rsquo;re ready, <Link href="/book">book a Growth Strategy Call</Link>.</p>}
                {emailState === 'error' && <p className="err" role="alert">Please check the email address and try again.</p>}
                <button className="linkbtn" style={{ marginTop: 18 }} onClick={() => setDecision('yes')}>Actually, let&rsquo;s talk →</button>
              </div>
            )}
            <div className="lab-nav"><button className="linkbtn" onClick={() => go(4)}>Back</button><button className="linkbtn" onClick={reset}>Start over</button></div>
          </section>
        )}
      </div>
    </div>
  );
}
