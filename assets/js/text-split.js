/**
 * Splits headings into letters ([data-split]) and paragraphs into words ([data-words])
 * so motion.css can reveal them one piece at a time. Each piece gets its index in --i and
 * the container gets the total in --n (used to run the sequence backwards when hiding).
 */
import { $$ } from "./utils.js";

export function splitText(el, mode) {
  el.querySelectorAll(":scope > .sr-only").forEach(n => n.remove());   // re-split after a language switch

  // Letter-split headings keep one readable copy for screen readers; the letters are aria-hidden.
  const label = mode === "ch"
    ? el.innerHTML.replace(/<br\s*\/?>/gi, " ").replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
    : "";

  let i = 0;
  const walk = node => [...node.childNodes].forEach(n => {
    if (n.nodeType === Node.TEXT_NODE) {
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach(part => {
        if (!part) return;
        if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
        const w = document.createElement("span");
        if (mode === "wd") {
          w.className = "wd";
          w.style.setProperty("--i", i++);
          w.textContent = part;
        } else {
          w.className = "w";
          w.setAttribute("aria-hidden", "true");
          for (const c of part) {
            const ch = document.createElement("span");
            ch.className = "ch";
            ch.style.setProperty("--i", i++);
            ch.textContent = c;
            w.appendChild(ch);
          }
        }
        frag.appendChild(w);
      });
      n.replaceWith(frag);
    } else if (n.nodeType === Node.ELEMENT_NODE && n.tagName !== "BR") {
      walk(n);
    }
  });
  walk(el);

  el.style.setProperty("--n", i);
  if (label) {
    const sr = document.createElement("span");
    sr.className = "sr-only";
    sr.textContent = label;
    el.prepend(sr);
  }
}

export function splitAll() {
  $$("[data-split]").forEach(el => splitText(el, "ch"));
  $$("[data-words]").forEach(el => splitText(el, "wd"));
}
