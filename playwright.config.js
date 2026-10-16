// Serves the static site locally and runs the checks in tests/ against it.
const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "tests",
  timeout: 30_000,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? [["list"], ["html", { open: "never" }]] : "list",
  use: { baseURL: "http://127.0.0.1:4173", locale: "pt-BR" },
  webServer: {
    command: "npm run servir",
    url: "http://127.0.0.1:4173",
    reuseExistingServer: !process.env.CI,
    stderr: "ignore",
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "celular", use: { ...devices["Pixel 7"] } },
  ],
});
