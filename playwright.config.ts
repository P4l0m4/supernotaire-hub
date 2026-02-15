import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "tests/e2e",
  retries: 0,
  use: {
    baseURL: "https://easycase.fr",
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "webkit-ios",
      use: {
        ...devices["iPhone 14 Pro"],
        browserName: "webkit",
      },
    },
  ],
});
