/**
 * Site content. This is the only file to touch when adding a project, a tool or a contact.
 * Texts that are not tied to a project (headings, buttons) live in i18n.js.
 */

export const profile = {
  email: "higornovocardoso@gmail.com",
  links: [
    { label: "GitHub",   url: "https://github.com/higornovocardoso" },
    { label: "LinkedIn", url: "https://www.linkedin.com/in/higornovocardoso" }
  ]
};

export const projects = [
  {
    url: "https://github.com/higornovocardoso/Logisteca-que-Aquece",
    title: { pt: "Logística que Aquece", en: "Logística que Aquece" },
    desc:  { pt: "Sistema de controle de estoque desenvolvido para a Rede Feminina de Garopaba. Foi o primeiro sistema que desenvolvi e marcou o início da minha carreira. Criado para a campanha de agasalhos promovida pelo SENAI, organizou as roupas arrecadadas que a Rede Feminina doou a pessoas em situação de vulnerabilidade durante o inverno de 2025, em Garopaba.",
             en: "An inventory control system developed for Rede Feminina de Garopaba. It was the first system I built and marked the start of my career. Created for a winter clothing drive organized by SENAI, it managed the donated clothes that Rede Feminina distributed to people in need during the winter of 2025 in Garopaba." },
    tags: ["JavaScript", "TypeScript", "HTML"]
  },
  {
    url: "https://github.com/higornovocardoso/central-de-chamados-de-ti",
    title: { pt: "Central de Chamados", en: "Central de Chamados" },
    desc:  { pt: "Sistema de gestão de chamados inspirado no GLPI, desenvolvido para os escritórios de contabilidade aos quais, além do desenvolvimento de sistemas, presto serviços de T.I.",
             en: "A ticket management system inspired by GLPI, built for the accounting firms where, in addition to software development, I provide IT services." },
    tags: ["TypeScript", "PL/pgSQL", "CSS"]
  },
  {
    url: "https://github.com/higornovocardoso/Portal-Compliance-Contabil",   // private: only people given access can open it
    title: { pt: "Portal Compliance", en: "Portal Compliance" },
    desc:  { pt: "Plataforma de automação contábil da Compliance Contábil, responsável pela emissão automática de guias fiscais (DARF DCTFWeb, DAS do Simples Nacional e DAS MEI) e pelo controle de certificados digitais.",
             en: "Compliance Contábil's accounting automation platform, responsible for automatically issuing tax payment slips (DARF DCTFWeb, Simples Nacional DAS and MEI DAS) and for managing digital certificates." },
    tags: ["Python", "TypeScript", "JavaScript", "PowerShell"]
  }
];

export const stack = [
  { k: { pt: "Linguagens", en: "Languages" },         v: ["Python", "TypeScript", "JavaScript", "SQL", "HTML/CSS"] },
  { k: { pt: "Frameworks", en: "Frameworks" },        v: ["Node.js", "Express", "React", "Next.js"] },
  { k: { pt: "Banco de dados", en: "Databases" },     v: ["PostgreSQL", "Supabase"] },
  { k: { pt: "Integrações", en: "Integrations" },     v: ["APIs REST", "SERPRO Integra Contador", "Microsoft Graph", "SharePoint", "Teams"] },
  { k: { pt: "Infraestrutura", en: "Infrastructure" }, v: ["Git", "GitHub", "Vercel", "Docker", "PowerShell"] }
];
