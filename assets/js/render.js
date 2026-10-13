/**
 * Builds the parts of the page that come from content.js (projects, stack, tools strip,
 * contact links) and applies the current language to every [data-i18n] element.
 */
import { profile, projects, stack } from "./content.js";
import { getLang, setLang, t } from "./i18n.js";
import { $, $$ } from "./utils.js";
import { splitAll } from "./text-split.js";
import { indexChildren, watchReveal } from "./reveal.js";
import { bindCursorTargets } from "./cursor.js";

const ARROW = `<svg width="18" height="18" viewBox="0 0 18 18" fill="none"><path d="M2 9h14M10 3l6 6-6 6" stroke="currentColor" stroke-width="1.5"/></svg>`;

function renderProjects() {
  const lang = getLang();
  // A project with a link is one big <a>: clicking anywhere on the row opens the repository.
  $("#projects").innerHTML = projects.map(p => {
    const tag = p.url ? "a" : "article";
    const attrs = p.url ? ` href="${p.url}" target="_blank" rel="noopener" data-cursor="${t("work.open")}"` : "";
    return `
    <${tag} class="proj rv"${attrs}>
      <div class="proj-body">
        <h3 class="display">${p.title[lang]}</h3>
        <p>${p.desc[lang]}</p>
        <ul class="tags">${p.tags.map(x => `<li>${x}</li>`).join("")}</ul>
      </div>
      ${p.url ? `<span class="proj-go" aria-hidden="true">${ARROW}</span>` : ""}
    </${tag}>`;
  }).join("");
  $("#projCount").textContent = t("work.count").replace("{n}", String(projects.length).padStart(2, "0"));
}

function renderStack() {
  const lang = getLang();
  $("#stackList").innerHTML = stack.map(group => `
    <div class="stack-row"><div class="label">${group.k[lang]}</div><ul>${group.v.map(x => `<li>${x}</li>`).join("")}</ul></div>`).join("");
}

/** Parts that do not change with the language. */
export function renderStatic() {
  const tools = stack.flatMap(group => group.v);   // the strip lists every tool from the Stack section
  $("#mq").innerHTML = [...tools, ...tools].map(w => `<span>${w}</span>`).join("");
  $("#mailAddr").textContent = profile.email;
  $("#mailRow").hidden = !profile.email;
  $("#socials").innerHTML = profile.links
    .map(l => `<a class="btn" href="${l.url}" target="_blank" rel="noopener">${l.label} ↗</a>`)
    .join("");
}

export function applyLang() {
  const lang = getLang();
  document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
  $$("[data-i18n]").forEach(el => { el.innerHTML = t(el.dataset.i18n); });
  $$(".lang button").forEach(b => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
  renderProjects();
  renderStack();
  bindCursorTargets();
  splitAll();
  $$(".stagger").forEach(indexChildren);
  watchReveal();
}

export function setupLanguageSwitch() {
  $$(".lang button").forEach(b => b.addEventListener("click", () => {
    setLang(b.dataset.lang);
    applyLang();
  }));
}
