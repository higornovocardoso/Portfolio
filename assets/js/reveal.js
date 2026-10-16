/**
 * Scroll reveals, both ways.
 * An element shows once its top passes 88% of the viewport, and hides again when you scroll back
 * up and it drops below that line. Elements you have scrolled past (above the screen) stay visible.
 * The "off" class is the hidden state; motion.css animates the change.
 */
import { $$ } from "./utils.js";

const SELECTOR = ".rv, .stagger, [data-split], [data-words]";
let observer = null;

/** Gives each child of a .stagger container its index (--i) and the container its count (--n). */
export function indexChildren(el) {
  [...el.children].forEach((c, i) => c.style.setProperty("--i", i));
  el.style.setProperty("--n", el.children.length);
}

export function setupReveal() {
  if (!("IntersectionObserver" in window)) return;          // without it everything simply stays visible
  observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.remove("off");
    else if (e.boundingClientRect.top > 0) e.target.classList.add("off");   // went back below the screen
    else e.target.classList.remove("off");                                  // scrolled past it (e.g. a menu jump)
  }), { rootMargin: "0px 0px -12% 0px" });
  watchReveal();
}

/** Starts observing any element not observed yet (called again after a re-render). */
export function watchReveal() {
  if (!observer) return;
  $$(SELECTOR).forEach(el => {
    if (el.dataset.watched) return;
    el.dataset.watched = "1";
    if (el.getBoundingClientRect().top > innerHeight * .88) el.classList.add("off");
    observer.observe(el);
  });
}
