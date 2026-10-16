/**
 * The particle sphere in the hero (Three.js).
 *
 * ~15k points on a Fibonacci sphere, displaced in the vertex shader by simplex noise.
 * The mouse tilts it, bulges the side facing the cursor and stirs the surface while moving.
 * Scrolling away swells and lifts it. `burst()` plays the opening: every point leaves the
 * center, swirls, overshoots and settles. Rendering pauses while the hero is off screen.
 */
import * as THREE from "three";
import { vertexShader, fragmentShader } from "./shaders.js";

const BURST_MS = 2000;

export function startSphere({ canvas, hero, reduced }) {
  let renderer;
  try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true }); }
  catch (e) { return { burst() {} }; }                  // no WebGL: the page works without the sphere
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(40, 1, .1, 50);

  // Evenly spread points on a unit sphere (golden-angle spiral).
  const N = innerWidth < 700 ? 7000 : 15000;
  const pos = new Float32Array(N * 3), rnd = new Float32Array(N);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2, r = Math.sqrt(1 - y * y), th = golden * i;
    pos[i * 3] = Math.cos(th) * r; pos[i * 3 + 1] = y; pos[i * 3 + 2] = Math.sin(th) * r;
    rnd[i] = Math.random();
  }
  const geo = new THREE.BufferGeometry();
  geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  geo.setAttribute("aRand", new THREE.BufferAttribute(rnd, 1));

  const css = getComputedStyle(document.documentElement);
  const accent = new THREE.Color(css.getPropertyValue("--accent").trim() || "#5B6BFF");
  const paper = new THREE.Color(css.getPropertyValue("--paper").trim() || "#ECEBE6");

  const uni = {
    uIntro: { value: reduced ? 1 : 0 }, uTime: { value: 0 }, uAmp: { value: 1 },
    uPixel: { value: renderer.getPixelRatio() }, uCam: { value: 4.4 }, uHover: { value: 0 },
    uAccent: { value: accent }, uPaper: { value: paper }, uMouse: { value: new THREE.Vector2() },
  };
  const mat = new THREE.ShaderMaterial({
    uniforms: uni, vertexShader, fragmentShader,
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
  });

  const grp = new THREE.Group();
  grp.add(new THREE.Points(geo, mat));
  scene.add(grp);

  // Thin orbit ring for scale.
  const ring = new THREE.Mesh(
    new THREE.RingGeometry(1.62, 1.625, 160),
    new THREE.MeshBasicMaterial({ color: accent, transparent: true, opacity: .35, side: THREE.DoubleSide }),
  );
  ring.rotation.x = Math.PI * .42;
  grp.add(ring);

  function size() {
    const w = canvas.clientWidth, h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.position.z = w < 700 ? 5.6 : 4.4;
    uni.uCam.value = camera.position.z;
    camera.updateProjectionMatrix();
  }
  size();
  addEventListener("resize", size);

  // Mouse: target tilt (tx, ty) and "energy" that grows with pointer speed and decays each frame.
  let tx = 0, ty = 0, visible = true, last = performance.now(), clock = 0, energy = 0, px = null, py = null;
  let burstAt = null;
  addEventListener("pointermove", e => {
    tx = (e.clientX / innerWidth - .5) * 2;
    ty = (e.clientY / innerHeight - .5) * 2;
    if (px !== null) energy = Math.min(1, energy + Math.hypot(e.clientX - px, e.clientY - py) / 260);
    px = e.clientX; py = e.clientY;
  }, { passive: true });

  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    if (visible && !reduced) requestAnimationFrame(frame);
  }).observe(hero);

  function frame(now) {
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    energy *= .94;
    clock += dt * (1 + energy * 2.5);                   // noise runs faster while the mouse moves
    const sc = Math.min(scrollY / innerHeight, 1);

    uni.uTime.value = clock;
    uni.uHover.value += (energy - uni.uHover.value) * .15;
    uni.uAmp.value = 1 + sc * 1.6;
    uni.uMouse.value.x += (tx - uni.uMouse.value.x) * .12;
    uni.uMouse.value.y += (-ty - uni.uMouse.value.y) * .12;
    if (burstAt !== null) uni.uIntro.value = Math.min(1, (now - burstAt) / BURST_MS);

    grp.rotation.y = clock * .08 + uni.uMouse.value.x * .9;
    grp.rotation.x = -uni.uMouse.value.y * .6 + sc * .6;
    grp.scale.setScalar(1 + uni.uHover.value * .06);
    grp.position.y = sc * .9;
    ring.rotation.z = clock * .15;
    ring.material.opacity = .35 * Math.min(1, Math.max(0, uni.uIntro.value * 2 - 1));

    renderer.render(scene, camera);
    if (visible && !reduced) requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  return { burst() { burstAt = performance.now(); } };
}
