import { defineConfig, devices } from '@playwright/test'

const port = Number(process.env.E2E_PORT || 5173)
// CI runs assertion-only: no video/trace, no slow-motion.
const isCI = Boolean(process.env.CI)
const baseURL = `http://localhost:${port}`
const webServer = process.env.E2E_NO_WEBSERVER
  ? undefined
  : {
      command: `npx vite --host 0.0.0.0 --port ${port} --strictPort`,
      url: baseURL,
      reuseExistingServer: true,
      timeout: 120_000,
    }

/**
 * Playwright config for the customer demo / walkthrough.
 *
 * Records a video, a screenshot and a trace for EVERY run (not just failures),
 * so the whole site and its functionality are captured for the customer.
 * Artifacts land in `demo-artifacts/` (videos/traces) + `demo-artifacts/shots`
 * (named step screenshots) and an HTML report in `playwright-report/`.
 *
 *   npm run test:e2e          # run the demo, record everything
 *   npm run test:e2e:report   # open the HTML report (video + trace + steps)
 */
export default defineConfig({
  testDir: './tests/e2e',
  outputDir: './demo-artifacts',
  timeout: 90_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  workers: 1,
  reporter: [['list'], ['html', { outputFolder: 'playwright-report', open: 'never' }]],
  use: {
    baseURL,
    video: isCI ? 'off' : 'on',
    screenshot: isCI ? 'only-on-failure' : 'on',
    trace: isCI ? 'retain-on-failure' : 'on',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'desktop-demo',
      testMatch: /(demo|planning-explorer)\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        launchOptions: { slowMo: isCI ? 0 : 250 }, // slow down so the recording is watchable
      },
    },
    {
      name: 'mobile-demo',
      testMatch: /(mobile|planning-explorer)\.spec\.js/,
      use: {
        ...devices['Pixel 7'],
        launchOptions: { slowMo: isCI ? 0 : 250 },
      },
    },
    {
      name: 'tablet-demo',
      testMatch: /(tablet|planning-explorer)\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 768, height: 1024 },
        isMobile: true,
        hasTouch: true,
        launchOptions: { slowMo: isCI ? 0 : 250 },
      },
    },
  ],
  webServer,
})
