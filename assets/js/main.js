/**
 * Entry point. Renders the content, wires every interaction and plays the opening:
 *   0.0s  a point of light appears in the center of the hero
 *   0.8s  it explodes and the particles fly out to form the sphere
 *   1.5s  the name rises letter by letter, the rest of the hero fades in, scrolling unlocks
 * With "reduce motion" turned on in the system, everything is shown at once.
 */
import { $, prefersReducedMotion } from "./utils.js";
import { renderStatic, applyLang, setupLanguageSwitch } from "./render.js";
import { setupCursor, setupMagnets } from "./cursor.js";
import { setupCopyEmail } from "./contact.js";
import { setupReveal } from "./reveal.js";
import { setupScroll } from "./scroll.js";
import { startMarquee } from "./marquee.js";

const reduced = prefersReducedMotion();
const root = document.documentElement;

scrollTo(0, 0);
addEventListener("beforeunload", () => scrollTo(0, 0));

renderStatic();
applyLang();
setupLanguageSwitch();
setupCopyEmail();
setupCursor();
setupMagnets(reduced);
setupScroll(reduced);
startMarquee(reduced);

// The 3D sphere is loaded on its own: if WebGL or the Three.js CDN fails, the rest of the site still works.
// If it arrives after the explosion moment (slow network), it bursts as soon as it is ready.
let sphere = null, burstRequested = false;
const burst = () => { burstRequested = true; if (sphere) sphere.burst(); };
import("./sphere/sphere.js")
  .then(m => {
    sphere = m.startSphere({ canvas: $("#gl"), hero: $(".hero"), reduced });
    if (burstRequested) sphere.burst();
  })
  .catch(err => console.warn("Esfera 3D indisponível:", err));

const seed = $("#seed");
const reveal = () => { root.classList.remove("pre"); setupReveal(); };

if (reduced) {
  seed.remove();
  reveal();
} else {
  root.classList.add("pre");
  seed.classList.add("on");                                                          // a point of light appears
  setTimeout(() => { seed.classList.replace("on", "go"); burst(); }, 800);            // ...and explodes
  setTimeout(reveal, 1500);                                                          // the name rises
  setTimeout(() => seed.remove(), 1600);
}
