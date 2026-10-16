/** Scroll-linked motion: reading progress bar, hero parallax and the active menu link. */
import { $, $$ } from "./utils.js";

export function setupScroll(reduced) {
  const bar = $("#progress");
  const name = $("#name");
  const role = $(".hero-role");
  let ticking = false;

  const update = () => {
    ticking = false;
    const y = scrollY;
    const max = document.documentElement.scrollHeight - innerHeight;
    bar.style.transform = `scaleX(${max > 0 ? Math.min(1, y / max) : 0})`;
    if (!reduced && y < innerHeight * 1.2) {            // only while the hero is (almost) on screen
      const k = y / innerHeight;
      name.style.transform = `translate3d(0, ${y * .25}px, 0)`;
      name.style.opacity = String(Math.max(0, 1 - k * .9));
      role.style.transform = `translate3d(0, ${y * .12}px, 0)`;
    }
  };
  addEventListener("scroll", () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();

  if ("IntersectionObserver" in window) {
    const links = $$(".nav a");
    const sections = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    }), { rootMargin: "-45% 0px -50% 0px" });
    $$("main section[id]").forEach(sec => sections.observe(sec));
  }
}
