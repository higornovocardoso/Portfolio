/** Small shared helpers. */

export const $ = (selector, root = document) => root.querySelector(selector);
export const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];

export const prefersReducedMotion = () => matchMedia("(prefers-reduced-motion: reduce)").matches;
export const hasFinePointer = () => matchMedia("(hover: hover) and (pointer: fine)").matches;
