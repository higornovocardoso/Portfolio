/**
 * Custom cursor (mouse only): a dot that follows the pointer and grows with a label over
 * elements that have data-cursor. Plus "magnetic" buttons that lean toward the pointer.
 */
import { $, $$, hasFinePointer } from "./utils.js";

const cur = $("#cur");
const curLabel = $("#curLabel");

export function setupCursor() {
  if (!hasFinePointer()) return;
  let mx = -100, my = -100, cx = mx, cy = my, on = false;

  addEventListener("pointermove", e => {
    mx = e.clientX; my = e.clientY;
    if (!on && e.pointerType === "mouse") {            // stay hidden until the mouse actually moves
      on = true; cx = mx; cy = my;
      cur.classList.add("live");
    }
  }, { passive: true });
  document.documentElement.addEventListener("mouseleave", () => {
    on = false;
    cur.classList.remove("live", "big");
  });

  (function follow() {
    cx += (mx - cx) * .5;
    cy += (my - cy) * .5;
    cur.style.transform = `translate(${cx}px, ${cy}px)`;
    requestAnimationFrame(follow);
  })();
}

/** Binds the grow-with-label behaviour; safe to call again after a re-render. */
export function bindCursorTargets() {
  $$("[data-cursor]").forEach(el => {
    if (el.dataset.cursorBound) return;
    el.dataset.cursorBound = "1";
    el.addEventListener("pointerenter", () => { curLabel.textContent = el.dataset.cursor; cur.classList.add("big"); });
    el.addEventListener("pointerleave", () => cur.classList.remove("big"));
    el.addEventListener("click", () => cur.classList.remove("big"));
  });
}

export function setupMagnets(reduced) {
  if (reduced || !hasFinePointer()) return;
  $$(".btn, .scroll-cue").forEach(el => {
    el.addEventListener("pointermove", e => {
      const r = el.getBoundingClientRect();
      el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * .25}px, ${(e.clientY - r.top - r.height / 2) * .35}px)`;
    });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; });
  });
}
