import { test, expect } from "@playwright/test";

const pages = [
  "/outils/pre-etat-date",
  "/outils/checklist-dossier-vente-notaire",
];

test.setTimeout(90_000);

test.use({
  browserName: "webkit",
  viewport: { width: 393, height: 852 }, // iPhone 14 Pro logical size
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

test.describe("Invalid qualified name regressions (WebKit/iOS)", () => {
  for (const path of pages) {
    test(`no InvalidCharacterError or emitsOptions crash on ${path}`, async ({
      page,
    }) => {
      const consoleMessages: string[] = [];
      const errors: Error[] = [];

      // Empêcher le tutoriel/driver de se lancer avant le chargement
      await page.addInitScript(() => {
        try {
          localStorage.setItem("checklist-tour-done", "1");
          localStorage.removeItem("checklist-tour");
          localStorage.setItem("ped-tour-done", "1");
          localStorage.removeItem("ped-tour-documents");
        } catch {
          /* ignore */
        }
      });

      page.on("console", (msg) => {
        const text = msg.text();
        const loc = msg.location();
        const locStr =
          loc && loc.url
            ? `${loc.url}:${loc.lineNumber ?? 0}:${loc.columnNumber ?? 0}`
            : "";
        consoleMessages.push(
          [msg.type(), text, locStr].filter(Boolean).join(" | "),
        );
      });
      page.on("pageerror", (err) => {
        errors.push(err);
      });

      await page.goto(path, { waitUntil: "domcontentloaded" });
      await page.waitForLoadState("load", { timeout: 15_000 });
      // Nettoyer overlays driver si présents
      await page.evaluate(() => {
        try {
          localStorage.setItem("checklist-tour-done", "1");
          localStorage.removeItem("checklist-tour");
          localStorage.setItem("ped-tour-done", "1");
          localStorage.removeItem("ped-tour-documents");
          const killDriver = () => {
            document.querySelector(".driver-overlay")?.remove();
            document
              .querySelectorAll(".driver-popover, .driver-highlighted-element")
              .forEach((el) => el.remove());
            document.body.classList.remove("driver-active", "driver-fade");
          };
          killDriver();
          const obs = new MutationObserver(() => killDriver());
          obs.observe(document.body, { childList: true, subtree: true });
          setTimeout(() => obs.disconnect(), 5000);
        } catch {
          /* ignore */
        }
      });
      // Fermer le tutoriel/modal éventuel qui peut bloquer la page
      const onboardingClose = page
        .getByRole("dialog", { name: /commencez par les justificatifs/i })
        .getByRole("button", { name: /terminer|close|×/i });
      await onboardingClose.click({ timeout: 2000 }).catch(() => {});

      // give hydration / deferred scripts time to run
      await page.waitForTimeout(2000);

      // Open mobile menu to trigger potential overlay code paths
      const menuBtn = await page.$(
        'button[aria-label="menu"], button.menu-button',
      );
      if (menuBtn) {
        await menuBtn.click({ trial: true }).catch(() => {});
        try {
          await page.evaluate(() => {
            document.querySelector(".driver-overlay")?.remove();
            document.body.classList.remove("driver-active", "driver-fade");
          });
        } catch {
          // ignore evaluate errors (page may have navigated/closed)
        }
        await menuBtn.click().catch(() => {});
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
