import { defineConfig } from '@playwright/test'

// Uses the Microsoft Edge already installed on this machine (channel: 'msedge'), so no browser download is needed.
// PW_BASE_URL=https://... runs the same tests against a deployed site (no local server).
const live = process.env.PW_BASE_URL

export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['junit', { outputFile: live ? 'docs/test-results/e2e-live-junit.xml' : 'docs/test-results/e2e-junit.xml' }],
    ['json', { outputFile: live ? 'reports/test-results/e2e-live.json' : 'reports/test-results/e2e-local.json' }]],
  use: { baseURL: live ?? 'http://localhost:4173', channel: 'msedge', locale: 'tr-TR', acceptDownloads: true },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: live ? undefined : { command: 'npm run build && npm run preview', url: 'http://localhost:4173', reuseExistingServer: false, timeout: 120_000 },
})
