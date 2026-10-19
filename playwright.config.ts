import { defineConfig } from '@playwright/test'

// Uses the Microsoft Edge already installed on this machine (channel: 'msedge'), so no browser download is needed.
export default defineConfig({
  testDir: './e2e',
  timeout: 60_000,
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['junit', { outputFile: 'docs/test-results/e2e-junit.xml' }]],
  use: { baseURL: 'http://localhost:4173', channel: 'msedge', locale: 'tr-TR', acceptDownloads: true },
  projects: [
    { name: 'desktop', use: { viewport: { width: 1440, height: 900 } } },
    { name: 'mobile', use: { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 } },
  ],
  webServer: { command: 'npm run build && npm run preview', url: 'http://localhost:4173', reuseExistingServer: false, timeout: 120_000 },
})
