// 3D "GTM engine": wireframe core + six orbiting nodes (the six GTM systems) + orbit rings.
import * as THREE from 'three';

export function startEngine(canvas: HTMLCanvasElement) {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 100);
  camera.position.set(0, 0, 9);

  const NAVY = new THREE.Color('#0f1e3d'), MAROON = new THREE.Color('#7a1f2b'), SLATE = new THREE.Color('#5b6b88');
  const group = new THREE.Group(); scene.add(group);

  // core: icosahedron wireframe + inner solid
  const coreGeo = new THREE.IcosahedronGeometry(1.55, 1);
  const wire = new THREE.LineSegments(new THREE.WireframeGeometry(coreGeo), new THREE.LineBasicMaterial({ color: NAVY, transparent: true, opacity: 0.55 }));
  group.add(wire);
  const inner = new THREE.Mesh(new THREE.IcosahedronGeometry(0.95, 0), new THREE.MeshStandardMaterial({ color: MAROON, metalness: 0.35, roughness: 0.35, flatShading: true }));
  group.add(inner);
  const halo = new THREE.Mesh(new THREE.SphereGeometry(2.05, 32, 32), new THREE.MeshBasicMaterial({ color: NAVY, wireframe: true, transparent: true, opacity: 0.06 }));
  group.add(halo);

  // orbit rings
  const rings: THREE.Mesh[] = [];
  [[2.7, 0.25, 0], [3.2, -0.5, 0.6], [3.7, 0.9, -0.4]].forEach(([r, rx, rz], i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, 0.008, 8, 160), new THREE.MeshBasicMaterial({ color: i === 1 ? MAROON : SLATE, transparent: true, opacity: 0.45 }));
    ring.rotation.set(Math.PI / 2 + rx, 0, rz); group.add(ring); rings.push(ring);
  });

  // six nodes (GTM systems) travelling on the rings
  const nodes = Array.from({ length: 6 }, (_, i) => {
    const m = new THREE.Mesh(new THREE.SphereGeometry(i % 2 ? 0.13 : 0.17, 24, 24), new THREE.MeshStandardMaterial({ color: i % 3 === 0 ? MAROON : NAVY, metalness: 0.2, roughness: 0.4 }));
    group.add(m); return { m, ring: rings[i % 3], phase: (i / 6) * Math.PI * 2, speed: 0.25 + (i % 3) * 0.08 };
  });

  // connection lines from nodes to core
  const linkGeo = new THREE.BufferGeometry(); const linkPos = new Float32Array(6 * 2 * 3);
  linkGeo.setAttribute('position', new THREE.BufferAttribute(linkPos, 3));
  group.add(new THREE.LineSegments(linkGeo, new THREE.LineBasicMaterial({ color: MAROON, transparent: true, opacity: 0.25 })));

  scene.add(new THREE.AmbientLight(0xffffff, 1.1));
  const key = new THREE.DirectionalLight(0xffffff, 1.6); key.position.set(4, 5, 6); scene.add(key);
  const rim = new THREE.PointLight(0xb9465a, 2.2, 20); rim.position.set(-4, -2, 3); scene.add(rim);

  let mx = 0, my = 0, raf = 0, running = true;
  const resize = () => { const w = canvas.clientWidth, h = canvas.clientHeight; if (!w || !h) return; renderer.setSize(w, h, false); camera.aspect = w / h; camera.updateProjectionMatrix(); };
  const ro = new ResizeObserver(resize); ro.observe(canvas); resize();
  const onMove = (e: PointerEvent) => { mx = e.clientX / window.innerWidth - 0.5; my = e.clientY / window.innerHeight - 0.5; };
  window.addEventListener('pointermove', onMove, { passive: true });
  const io = new IntersectionObserver(([e]) => { running = e.isIntersecting; if (running) loop(); }, { threshold: 0 });
  io.observe(canvas);

  const tmp = new THREE.Vector3(); const clock = new THREE.Clock();
  const loop = () => {
    if (!running) return;
    raf = requestAnimationFrame(loop);
    const t = clock.getElapsedTime();
    group.rotation.y += ((mx * 0.8 + t * 0.12) - group.rotation.y) * 0.04;
    group.rotation.x += ((my * 0.5 + Math.sin(t * 0.3) * 0.1) - group.rotation.x) * 0.04;
    wire.rotation.y = t * 0.15; wire.rotation.z = t * 0.07;
    inner.rotation.x = -t * 0.3; inner.rotation.y = t * 0.25;
    inner.scale.setScalar(1 + Math.sin(t * 1.6) * 0.04);
    nodes.forEach((n, i) => {
      const a = n.phase + t * n.speed; const r = (n.ring.geometry as THREE.TorusGeometry).parameters.radius;
      tmp.set(Math.cos(a) * r, Math.sin(a) * r, 0).applyEuler(n.ring.rotation);
      n.m.position.copy(tmp);
      linkPos.set([0, 0, 0, tmp.x, tmp.y, tmp.z], i * 6);
    });
    linkGeo.attributes.position.needsUpdate = true;
    renderer.render(scene, camera);
  };
  loop();

  return () => { running = false; cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); renderer.dispose(); };
}
