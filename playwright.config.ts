import { defineConfig, devices } from "@playwright/test";

const localBaseURL = process.env.LOCAL_E2E ? "http://localhost:3000" : null;

export default defineConfig({
  testDir: "tests/e2e",
  retries: 0,
  use: {
    baseURL: localBaseURL || "https://easycase.fr",
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
