/** Interface texts in Portuguese and English, plus the current-language state. */

export const strings = {
  pt: {
    "nav.about":"Sobre","nav.work":"Projetos","nav.process":"Processo","nav.stack":"Stack","nav.contact":"Contato",
    "hero.eyebrow":"Portfólio","hero.role":"Desenvolvedor Back-End",
    "hero.scroll":"Role para explorar",
    "about.k":"Apresentação","about.t":"Sobre mim",
    "about.lead":"Meu nome é <em>Higor</em>, tenho <em>17 anos</em> e sou um entusiasta da tecnologia. Moro em <em>Garopaba</em>, <em>Santa Catarina</em>, onde ajudo escritórios de contabilidade a automatizar processos, para que produzam mais com menos.",
    "work.k":"Trabalho","work.t":"Projetos","work.count":"{n} projetos","work.open":"abrir",
    "proc.k":"Como eu trabalho","proc.t":"Do manual ao automático",
    "proc.s1t":"Mapear","proc.s1p":"Entendo como o processo é feito, quem participa dele e onde está o trabalho repetitivo.",
    "proc.s2t":"Automatizar","proc.s2p":"Desenvolvo a solução responsável por automatizar o trabalho repetitivo.",
    "proc.s3t":"Acompanhar","proc.s3p":"Monitoro o funcionamento e faço ajustes sempre que o processo ou as regras mudarem.",
    "stack.k":"Ferramentas","stack.t":"Stack",
    "contact.k":"Contato","contact.t1":"Vamos","contact.t2":"automatizar?","contact.copy":"Copiar e-mail","contact.copied":"E-mail copiado",
    "contact.copyfail":"E-mail selecionado, copie manualmente"
  },
  en: {
    "nav.about":"About","nav.work":"Work","nav.process":"Process","nav.stack":"Stack","nav.contact":"Contact",
    "hero.eyebrow":"Portfolio","hero.role":"Back-End Developer",
    "hero.scroll":"Scroll to explore",
    "about.k":"Introduction","about.t":"About me",
    "about.lead":"My name is <em>Higor</em>. I am <em>17 years old</em> and passionate about technology. I live in <em>Garopaba</em>, <em>Santa Catarina</em>, Brazil, where I help accounting firms automate processes so they can do more with less.",
    "work.k":"Work","work.t":"Projects","work.count":"{n} projects","work.open":"open",
    "proc.k":"How I work","proc.t":"From manual to automatic",
    "proc.s1t":"Map","proc.s1p":"I learn how the process runs, who takes part in it and where the repetitive work is.",
    "proc.s2t":"Automate","proc.s2p":"I develop the solution that automates the repetitive work.",
    "proc.s3t":"Follow up","proc.s3p":"I monitor how it runs and adjust it whenever the process or the rules change.",
    "stack.k":"Tooling","stack.t":"Stack",
    "contact.k":"Contact","contact.t1":"Let's","contact.t2":"automate?","contact.copy":"Copy email","contact.copied":"Email copied",
    "contact.copyfail":"Email selected, copy it manually"
  }
};

const STORAGE_KEY = "hc-lang";
let lang = "pt";
try { lang = localStorage.getItem(STORAGE_KEY) || ((navigator.language || "pt").startsWith("pt") ? "pt" : "en"); } catch (e) {}

export const getLang = () => lang;
export function setLang(next) {
  lang = next;
  try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) {}
}
/** Translate a key, falling back to Portuguese and then to the key itself. */
export const t = key => (strings[lang] && strings[lang][key]) || strings.pt[key] || key;
