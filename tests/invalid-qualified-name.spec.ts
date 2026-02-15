import { test, expect } from "@playwright/test";

const pages = [
  "/outils/pre-etat-date",
  "/outils/checklist-dossier-vente-notaire",
];

// Runs on WebKit iPhone 14 Pro to mirror the reported device.
test.describe("Invalid qualified name regressions (WebKit/iOS)", () => {
  test.use({
    browserName: "webkit",
    viewport: { width: 393, height: 852 }, // iPhone 14 Pro logical size
    userAgent:
      "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
  });

  for (const path of pages) {
    test(`no InvalidCharacterError or emitsOptions crash on ${path}`, async ({
      page,
    }) => {
      const consoleMessages: string[] = [];
      const errors: Error[] = [];

      page.on("console", (msg) => {
        const text = msg.text();
        consoleMessages.push(text);
      });
      page.on("pageerror", (err) => {
        errors.push(err);
      });

      await page.goto(`https://easycase.fr${path}`, {
        waitUntil: "networkidle",
      });
      // give hydration / deferred scripts time to run
      await page.waitForTimeout(4000);

      // Open mobile menu to trigger potential overlay code paths
      const menuBtn = await page.$(
        'button[aria-label="menu"], button.menu-button',
      );
      if (menuBtn) {
        await menuBtn.click({ trial: true }).catch(() => {});
        await page.evaluate(() => {
          document.querySelector(".driver-overlay")?.remove();
          document.body.classList.remove("driver-active", "driver-fade");
        });
        await menuBtn.click().catch(() => {});
        await page.waitForTimeout(500);
      }

      const fatalConsole = consoleMessages.filter((t) =>
        /InvalidCharacterError|Invalid qualified name|emitsOptions/.test(t),
      );

      const fatalErrors = errors.filter((e) =>
        /InvalidCharacterError|Invalid qualified name|emitsOptions/.test(
          e.message,
        ),
      );

      expect(fatalConsole, `Console errors on ${path}`).toEqual([]);
      expect(fatalErrors, `Page errors on ${path}`).toEqual([]);
    });
  }
});
