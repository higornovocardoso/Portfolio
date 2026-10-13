/*
 * Loaded in <head> before the page paints (not a module, so it runs immediately).
 * Every load starts at the top so the opening plays again, and the page is held in its
 * "pre" state until main.js runs the opening. The timeout is a safety net: if anything
 * fails to load, the page is released after 4 seconds instead of staying hidden.
 */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
if (location.hash) history.replaceState(null, "", location.pathname + location.search);
window.scrollTo(0, 0);
document.documentElement.classList.add("pre");
setTimeout(function () { document.documentElement.classList.remove("pre"); }, 4000);
