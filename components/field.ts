// WebGL "molecular field": particles drift, react to cursor & scroll, and can cluster
// into the six GTM systems when the Lab dispatches `gtm:field` events.
import * as THREE from 'three';

const VERT = /* glsl */ `
  uniform float uTime; uniform float uCluster; uniform vec2 uMouse; uniform float uScroll; uniform float uPixel;
  attribute vec3 aTarget; attribute float aSeed; attribute vec3 aColor;
  varying vec3 vColor; varying float vAlpha;
  vec3 drift(vec3 p, float s){
    return vec3(sin(uTime*.12 + s*6.2831 + p.y*.6)*.35, cos(uTime*.10 + s*4.0 + p.x*.5)*.35, sin(uTime*.08 + s*3.0)*.25);
  }
  void main(){
    vec3 p = mix(position + drift(position, aSeed), aTarget + drift(aTarget, aSeed)*.25, uCluster);
    p.xy += uMouse * (0.25 + aSeed*.35);
    p.y += uScroll * (0.6 + aSeed);
    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_Position = projectionMatrix * mv;
    float size = (1.2 + aSeed*2.6) * uPixel;
    gl_PointSize = min(size * (9.0 / -mv.z), 6.5 * uPixel / 3.8);
    vColor = aColor;
    vAlpha = 0.35 + 0.65*fract(aSeed*7.13);
  }`;
const FRAG = /* glsl */ `
  varying vec3 vColor; varying float vAlpha;
  void main(){
    vec2 c = gl_PointCoord - .5; float d = length(c);
    float a = smoothstep(.5, .0, d);
    float alpha = a * vAlpha * .78;
    gl_FragColor = vec4(vColor * alpha, alpha);
  }`;

export function startField(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true, powerPreference: 'low-power' });
  const dpr = Math.min(window.devicePixelRatio || 1, 1.75);
  renderer.setPixelRatio(dpr);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(55, 1, 0.1, 100);
  camera.position.z = 9;

  const mobile = window.innerWidth < 760;
  const N = mobile ? 1000 : 2200;
  const pos = new Float32Array(N * 3), tgt = new Float32Array(N * 3), seed = new Float32Array(N), col = new Float32Array(N * 3);
  const palette = [new THREE.Color('#7a1f2b'), new THREE.Color('#1f3f74'), new THREE.Color('#5b6b88'), new THREE.Color('#9aa3b5')];
  // six cluster centres arranged on a ring (the six GTM systems)
  const centres = Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2 - Math.PI / 2; return new THREE.Vector3(Math.cos(a) * 3.2, Math.sin(a) * 2.1, 0); });
  for (let i = 0; i < N; i++) {
    const r = 3 + Math.random() * 9, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    pos[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.4; pos[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th); pos[i * 3 + 2] = r * Math.cos(ph) - 3;
    const c = centres[i % 6]; const rr = Math.pow(Math.random(), 1.6) * 0.9;
    const a2 = Math.random() * Math.PI * 2, b2 = Math.acos(2 * Math.random() - 1);
    tgt[i * 3] = c.x + rr * Math.sin(b2) * Math.cos(a2); tgt[i * 3 + 1] = c.y + rr * Math.sin(b2) * Math.sin(a2); tgt[i * 3 + 2] = c.z + rr * Math.cos(b2);
    seed[i] = Math.random();
    const pc = Math.random() < 0.4 ? palette[3] : palette[(i % 6) % 3];
    col[i * 3] = pc.r; col[i * 3 + 1] = pc.g; col[i * 3 + 2] = pc.b;
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
  geo.setAttribute('aTarget', new THREE.BufferAttribute(tgt, 3));
  geo.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));
  geo.setAttribute('aColor', new THREE.BufferAttribute(col, 3));
  const uniforms = { uTime: { value: 0 }, uCluster: { value: 0 }, uMouse: { value: new THREE.Vector2() }, uScroll: { value: 0 }, uPixel: { value: dpr * (mobile ? 3.2 : 3.8) } };
  const mat = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true, depthWrite: false, blending: THREE.NormalBlending, premultipliedAlpha: true });
  const points = new THREE.Points(geo, mat);
  scene.add(points);

  // reaction lines between cluster centres (visible when clustered)
  const lineGeo = new THREE.BufferGeometry();
  const lp: number[] = [];
  for (let i = 0; i < 6; i++) { const a = centres[i], b = centres[(i + 1) % 6]; lp.push(a.x, a.y, a.z, b.x, b.y, b.z); const c = centres[(i + 3) % 6]; if (i < 3) lp.push(a.x, a.y, a.z, c.x, c.y, c.z); }
  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(lp, 3));
  const lineMat = new THREE.LineBasicMaterial({ color: '#1f3f74', transparent: true, opacity: 0 });
  scene.add(new THREE.LineSegments(lineGeo, lineMat));

  let clusterTarget = 0, mx = 0, my = 0, raf = 0, running = true;
  const resize = () => { const w = window.innerWidth, h = window.innerHeight; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  resize();
  const onMove = (e: PointerEvent) => { mx = (e.clientX / window.innerWidth - 0.5) * 0.8; my = -(e.clientY / window.innerHeight - 0.5) * 0.6; };
  const onField = (e: Event) => { clusterTarget = (e as CustomEvent).detail?.cluster ? 1 : 0; };
  const onVis = () => { running = !document.hidden; if (running) loop(); };
  window.addEventListener('resize', resize);
  window.addEventListener('pointermove', onMove, { passive: true });
  window.addEventListener('gtm:field', onField);
  document.addEventListener('visibilitychange', onVis);

  const clock = new THREE.Clock();
  const loop = () => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    uniforms.uTime.value = t;
    uniforms.uCluster.value += (clusterTarget - uniforms.uCluster.value) * 0.03;
    uniforms.uMouse.value.x += (mx - uniforms.uMouse.value.x) * 0.04;
    uniforms.uMouse.value.y += (my - uniforms.uMouse.value.y) * 0.04;
    const sc = Math.min(window.scrollY / window.innerHeight, 6);
    uniforms.uScroll.value += (sc * 0.35 - uniforms.uScroll.value) * 0.06;
    points.rotation.y = t * 0.02 + sc * 0.08;
    lineMat.opacity = 0.05 + uniforms.uCluster.value * 0.25;
    renderer.render(scene, camera);
  };
  loop();

  return () => {
    running = false; cancelAnimationFrame(raf);
    window.removeEventListener('resize', resize); window.removeEventListener('pointermove', onMove);
    window.removeEventListener('gtm:field', onField); document.removeEventListener('visibilitychange', onVis);
    geo.dispose(); mat.dispose(); lineGeo.dispose(); lineMat.dispose(); renderer.dispose();
  };
}
