import { defineConfig, devices } from '@playwright/test'

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
    baseURL: 'http://localhost:5173',
    video: 'on',
    screenshot: 'on',
    trace: 'on',
    actionTimeout: 15_000,
  },
  projects: [
    {
      name: 'desktop-demo',
      testMatch: /demo\.spec\.js/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1440, height: 900 },
        launchOptions: { slowMo: 250 }, // slow down so the recording is watchable
      },
    },
    {
      name: 'mobile-demo',
      testMatch: /mobile\.spec\.js/,
      use: {
        ...devices['Pixel 7'],
        launchOptions: { slowMo: 250 },
      },
    },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: true,
    timeout: 120_000,
  },
})
