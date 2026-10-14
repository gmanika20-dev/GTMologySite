// Generative background music (Web Audio): warm, calm, corporate-ambient.
// No audio files, muted until the visitor opts in. Pitched in the mid range so laptop and phone speakers reproduce it.
let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let musicBus: GainNode | null = null;
let timer: ReturnType<typeof setInterval> | null = null;
export let soundOn = false;

const VOLUME = 0.9; // overall loudness of the music when sound is on

// Chord progression (Hz): Fmaj9 → Am7 → Dm9 → G6sus, ~7s each
const CHORDS: number[][] = [
  [174.61, 220.0, 329.63, 392.0],   // F3 A3 E4 G4
  [220.0, 261.63, 329.63, 392.0],   // A3 C4 E4 G4
  [146.83, 174.61, 261.63, 329.63], // D3 F3 C4 E4
  [196.0, 261.63, 293.66, 329.63],  // G3 C4 D4 E4
];
const CHORD_SECONDS = 7;
const STEP = 0.5; // melody grid (seconds)

function impulse(c: AudioContext, seconds = 3, decay = 2.5) {
  const len = c.sampleRate * seconds, buf = c.createBuffer(2, len, c.sampleRate);
  for (let ch = 0; ch < 2; ch++) { const d = buf.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, decay); }
  return buf;
}

function pad(freq: number, at: number, dur: number, dest: AudioNode) {
  if (!ctx) return;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0, at);
  g.gain.linearRampToValueAtTime(0.055, at + 1.6);
  g.gain.setValueAtTime(0.055, at + dur - 1.2);
  g.gain.linearRampToValueAtTime(0, at + dur + 1.2);
  const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 1600; lp.Q.value = 0.3;
  g.connect(lp).connect(dest);
  for (const [type, detune] of [['triangle', -5], ['sine', 5], ['sine', 1200]] as const) {
    const o = ctx.createOscillator(); o.type = type; o.frequency.value = freq; o.detune.value = detune;
    const og = ctx.createGain(); og.gain.value = detune === 1200 ? 0.25 : 1;
    o.connect(og).connect(g); o.start(at); o.stop(at + dur + 1.4);
  }
}

function pluck(freq: number, at: number, vol: number, dest: AudioNode) {
  if (!ctx) return;
  const o = ctx.createOscillator(), o2 = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o2.type = 'triangle'; o.frequency.value = freq; o2.frequency.value = freq * 2;
  const g2 = ctx.createGain(); g2.gain.value = 0.18;
  g.gain.setValueAtTime(0, at); g.gain.linearRampToValueAtTime(vol, at + 0.015); g.gain.exponentialRampToValueAtTime(0.0001, at + 1.6);
  o.connect(g); o2.connect(g2).connect(g); g.connect(dest);
  o.start(at); o2.start(at); o.stop(at + 1.7); o2.stop(at + 1.7);
}

export function blip() { if (soundOn && ctx && musicBus) pluck(880, ctx.currentTime + 0.01, 0.06, musicBus); }

export function startSound() {
  if (soundOn) return;
  ctx = ctx ?? new (window.AudioContext || (window as any).webkitAudioContext)();
  void ctx.resume();
  const c = ctx;
  // master → gentle compressor → speakers (keeps it even and clearly audible)
  const comp = c.createDynamicsCompressor(); comp.threshold.value = -20; comp.ratio.value = 3; comp.attack.value = 0.01; comp.release.value = 0.4;
  master = c.createGain(); master.gain.value = 0; master.connect(comp).connect(c.destination);
  master.gain.linearRampToValueAtTime(VOLUME, c.currentTime + 2);
  // music bus with reverb + echo
  musicBus = c.createGain(); musicBus.gain.value = 1;
  const dry = c.createGain(); dry.gain.value = 0.8;
  const verb = c.createConvolver(); verb.buffer = impulse(c); const wet = c.createGain(); wet.gain.value = 0.45;
  const delay = c.createDelay(2); delay.delayTime.value = STEP * 1.5; const fb = c.createGain(); fb.gain.value = 0.32; const dg = c.createGain(); dg.gain.value = 0.25;
  musicBus.connect(dry).connect(master);
  musicBus.connect(verb).connect(wet).connect(master);
  musicBus.connect(delay); delay.connect(fb).connect(delay); delay.connect(dg).connect(master);

  // scheduler
  let nextChord = c.currentTime + 0.1, chordIdx = 0, nextStep = c.currentTime + 0.6;
  const bus = musicBus;
  const tick = () => {
    if (!ctx) return;
    while (nextChord < ctx.currentTime + 1) {
      CHORDS[chordIdx].forEach((f) => pad(f, nextChord, CHORD_SECONDS, bus));
      chordIdx = (chordIdx + 1) % CHORDS.length; nextChord += CHORD_SECONDS;
    }
    while (nextStep < ctx.currentTime + 1) {
      const chord = CHORDS[(chordIdx + CHORDS.length - 1) % CHORDS.length];
      if (Math.random() < 0.55) pluck(chord[Math.floor(Math.random() * chord.length)] * 2, nextStep, 0.07 + Math.random() * 0.03, bus);
      nextStep += STEP * (Math.random() < 0.2 ? 2 : 1);
    }
  };
  tick(); timer = setInterval(tick, 250);
  soundOn = true;
  try { localStorage.setItem('gtm-sound', 'on'); } catch {}
}

export function stopSound() {
  if (timer) clearInterval(timer); timer = null;
  if (ctx && master) {
    const m = master; m.gain.cancelScheduledValues(ctx.currentTime);
    m.gain.setValueAtTime(m.gain.value, ctx.currentTime); m.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.8);
    setTimeout(() => m.disconnect(), 1500);
  }
  master = null; musicBus = null; soundOn = false;
  try { localStorage.setItem('gtm-sound', 'off'); } catch {}
}
