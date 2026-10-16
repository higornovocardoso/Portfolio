/** The tools strip below the hero: a steady drift that ignores scrolling and pauses off screen. */
import { $ } from "./utils.js";

const SPEED = 60;   // pixels per second

export function startMarquee(reduced) {
  const track = $("#mq");
  if (!track || reduced) return;
  let x = 0, last = performance.now(), visible = true;

  if ("IntersectionObserver" in window) {
    new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }).observe(track);
  }

  (function tick(now) {
    const dt = Math.min((now - last) / 1000, .05);
    last = now;
    if (visible) {
      const half = track.scrollWidth / 2;               // the list is rendered twice for a seamless loop
      x -= SPEED * dt;
      if (x <= -half) x += half;
      track.style.transform = `translate3d(${x}px, 0, 0)`;
    }
    requestAnimationFrame(tick);
  })(last);
}
