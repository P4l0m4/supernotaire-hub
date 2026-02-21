import { test, expect } from "@playwright/test";

test.setTimeout(60_000);

test.use({
  browserName: "webkit",
  viewport: { width: 393, height: 852 },
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});

const STORAGE_KEY = "sn-checklist-charges-taxes";

test.describe("Checklist - charges & taxes - export partiel", () => {
  test("compléter la rubrique via stockage puis exporter le partiel", async ({
    page,
  }) => {
    // Neutraliser les tutoriels Driver dès l'init
    await page.addInitScript(() => {
      try {
        localStorage.setItem("checklist-tour-done", "1");
        localStorage.removeItem("checklist-tour");
        localStorage.setItem("ped-tour-done", "1");
        localStorage.removeItem("ped-tour-documents");
        const style = document.createElement("style");
        style.textContent = `.driver-overlay, .driver-popover { display:none !important; }`;
        document.head.appendChild(style);
      } catch {
        /* ignore */
      }
    });

    await page.goto("/outils/checklist-dossier-vente-notaire/charges-taxes", {
      waitUntil: "domcontentloaded",
    });

    // Injecter des réponses complètes directement dans le stockage
    await page.evaluate((key) => {
      localStorage.clear();
      sessionStorage.clear();
      const payload = {
        type_bien: "Appartement",
        type_chauffage: "Électrique",
        mode_assainissement: "Collectif",
        situation_fiscale: "Résidence principale",
        montant_taxe_fonciere: 1200,
        presence_teom: "Non",
        bien_soumis_taxe_habitation: "Non",
        pret_immobilier_en_cours: "Non",
        coordonnees_bancaires_beneficiaires: [
          {
            __id: "b1",
            role_beneficiaire: "Propriétaire du bien (personne physique ou morale)",
          },
        ],
        __completed: true,
      };
      localStorage.setItem(key, JSON.stringify(payload));
    }, STORAGE_KEY);

    // Revenir à la liste des rubriques pour déclencher la lecture du stockage
    await page.goto("/outils/checklist-dossier-vente-notaire", {
      waitUntil: "domcontentloaded",
    });
    await page.waitForLoadState("networkidle", { timeout: 15_000 }).catch(() =>
      page.waitForLoadState("domcontentloaded"),
    );

    // Export partiel
    await page
      .getByRole("button", { name: /Exporter le récapitulatif/i })
      .click();
    const [download] = await Promise.all([
      page.waitForEvent("download"),
      page.getByRole("button", { name: /Export partiel/i }).click(),
    ]);

    expect(download.suggestedFilename()).toContain(
      "checklist-documents-notaire-vente-partiel",
    );
  });
});
