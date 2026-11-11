import { defineConfig, devices } from '@playwright/test';

/**
 * The demo app under test is Playwright's public TodoMVC instance
 * (override with BASE_URL to run against a local/staging deployment) —
 * a stable, realistic single-page app (add / complete / filter / edit /
 * delete / persistence) that makes the suite runnable by anyone.
 */
export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: process.env.CI ? [['html'], ['github']] : 'html',
  use: {
    baseURL: process.env.BASE_URL ?? 'https://demo.playwright.dev/todomvc/',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
});
