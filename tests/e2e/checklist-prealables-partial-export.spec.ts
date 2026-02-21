import { test, expect } from "@playwright/test";

test.setTimeout(90_000);

test.use({
  browserName: "webkit",
  viewport: { width: 393, height: 852 }, // iPhone 14 Pro
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

test.describe("Checklist - préalables - export partiel", () => {
  test("remplir la rubrique puis télécharger le PDF partiel", async ({
    page,
  }) => {
    // Empêcher le tutoriel (driver) de se lancer avant le chargement
    await page.addInitScript(() => {
      try {
        localStorage.setItem("checklist-tour-done", "1");
        localStorage.removeItem("checklist-tour");
      } catch {
        /* ignore */
      }
    });

    // Assainir l'état local pour un scénario propre
    await page.goto("/outils/checklist-dossier-vente-notaire/prealables", {
      waitUntil: "domcontentloaded",
    });
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
      localStorage.setItem("checklist-tour-done", "1");
      localStorage.removeItem("checklist-tour");
    });

    // Attendre l'apparition du formulaire
    await page
      .getByRole("heading", { name: "Informations préalables" })
      .waitFor({ timeout: 20_000 });

    // Adresse : saisie + sélection de la première suggestion
    const addressInput = page.getByRole("searchbox").first();
    await addressInput.waitFor({ state: "visible", timeout: 30_000 });
    await addressInput.scrollIntoViewIfNeeded();
    await addressInput.click({ timeout: 10_000, force: true });
    await addressInput.fill("10 rue de la paix, Paris");
    const firstSuggestion = page
      .locator(".location-search .list__address button")
      .first();
    await firstSuggestion.waitFor({ timeout: 12_000 });
    await firstSuggestion.click();

    // Type de bien : sélectionner "Appartement"
    const typeField = page
      .locator(".form-field")
      .filter({ hasText: "Type de bien" })
      .locator(".select-field__selected");
    await typeField.scrollIntoViewIfNeeded();
    await typeField.click({ timeout: 10_000 });
    await page
      .locator(".select-field__content__option", { hasText: "Appartement" })
      .click();

    // Valider la rubrique (un seul écran, bouton "Terminer")
    await page
      .getByRole("button", { name: "Terminer" })
      .click({ timeout: 10_000 });
    await page.waitForURL("**/outils/checklist-dossier-vente-notaire");
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() =>
      page.waitForLoadState("domcontentloaded"),
    );

    // Nettoyer toute instance de driver encore présente
    await page.evaluate(() => {
      localStorage.setItem("checklist-tour-done", "1");
      localStorage.removeItem("checklist-tour");
      document.querySelector(".driver-overlay")?.remove();
      document
        .querySelectorAll(".driver-popover, .driver-highlighted-element")
        .forEach((el) => el.remove());
      document.body.classList.remove("driver-active", "driver-fade");
    });
    await page.waitForTimeout(300);

    // Vérifier que la rubrique est marquée complétée côté stockage
    const completed = await page.evaluate(() => {
      const raw = localStorage.getItem("sn-checklist-prealables");
      if (!raw) return false;
      try {
        return JSON.parse(raw).__completed === true;
      } catch {
        return false;
      }
    });
    expect(completed).toBeTruthy();

    // Ouvrir le menu d'export et lancer l'export partiel
    await page
      .getByRole("button", { name: /Exporter le récapitulatif/i })
      .click();
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Export partiel/i }).click(),
    ]);

    // Le nom proposé doit correspondre à l'export partiel
    expect(download.suggestedFilename()).toContain(
      "checklist-documents-notaire-vente-partiel",
    );
  });
});
