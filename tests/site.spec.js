// Checks that run on every push: the page loads without errors, the content is all there,
// the main interactions work, and nothing breaks the layout on desktop or phone.
const { test, expect } = require("@playwright/test");

test.beforeEach(async ({ page }) => {
  page.errors = [];
  page.on("pageerror", e => page.errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") page.errors.push(m.text()); });
  // every file the page asks for (CSS, JS modules, images) must load
  page.on("response", r => { if (r.status() >= 400 && r.url().startsWith("http://127.0.0.1")) page.errors.push(`${r.status()} ${r.url()}`); });
  page.on("requestfailed", r => page.errors.push(`falhou: ${r.url()}`));
  await page.goto("/");
  await expect(page.locator("html")).not.toHaveClass(/pre/, { timeout: 6000 });   // opening finished
});

test.afterEach(async ({ page }) => {
  expect(page.errors, "erros no console da página").toEqual([]);
});

test("abre no topo com o nome e a função", async ({ page }) => {
  expect(await page.evaluate(() => scrollY)).toBe(0);
  await expect(page.getByRole("heading", { level: 1, name: "Higor Cardoso" })).toBeVisible();
  await expect(page.getByText("Desenvolvedor Back-End")).toBeVisible();
});

test("mostra os projetos com os links certos", async ({ page }) => {
  const cards = page.locator("#projects .proj");
  await expect(cards).toHaveCount(3);
  await expect(page.locator('#projects a.proj[href*="Logisteca-que-Aquece"]')).toHaveCount(1);
  await expect(page.locator('#projects a.proj[href*="central-de-chamados-de-ti"]')).toHaveCount(1);
  await expect(page.locator('#projects a.proj[href*="Portal-Compliance-Contabil"]')).toHaveCount(1);
  for (const a of await page.locator("#projects a.proj").all()) {
    await expect(a).toHaveAttribute("target", "_blank");
    await expect(a).toHaveAttribute("rel", /noopener/);
  }
});

test("o contato aparece ao rolar até o fim", async ({ page }) => {
  await page.locator("#contato").scrollIntoViewIfNeeded();
  const heading = page.locator("#contato h2");
  await expect(heading).not.toHaveClass(/off/);
  await expect(heading.locator(".sr-only")).toHaveText("Vamos automatizar?");
  await expect(page.locator("#mailAddr")).toHaveText("higornovocardoso@gmail.com");
  await expect(page.locator("#socials a")).toHaveCount(2);
});

test("troca para inglês e volta", async ({ page }) => {
  await page.locator("#lang-en").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "en");
  await expect(page.locator("#contato h2 .sr-only")).toHaveText("Let's automate?");
  await page.locator("#lang-pt").click();
  await expect(page.locator("html")).toHaveAttribute("lang", "pt-BR");
  await expect(page.locator("#sobre h2 .sr-only")).toHaveCount(1);            // no duplicated labels
});

test("nada vaza para os lados", async ({ page }) => {
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  expect(overflow).toBeLessThanOrEqual(0);
});

test("recarregar no fim volta ao topo", async ({ page }) => {
  await page.evaluate(() => scrollTo(0, document.body.scrollHeight));
  await page.reload();
  expect(await page.evaluate(() => scrollY)).toBe(0);
});

test("a esfera 3D é desenhada", async ({ page }) => {
  const canvas = page.locator("#gl");
  await expect(canvas).toBeVisible();
  expect(await canvas.evaluate(c => c.width > 0 && c.height > 0)).toBe(true);
});

test("página 404 própria", async ({ page }) => {
  page.errors = [];
  await page.goto("/404.html");
  await expect(page.getByRole("link", { name: "Voltar ao portfólio" })).toHaveAttribute("href", "/");
});
