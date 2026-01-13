import { describe, expect, it } from "vitest";
import { buildPartialDocDefinitionFromData } from "@/utils/rubriquesDossier";

const baseLogo = "data:image/png;base64,logo";

describe("buildPartialDocDefinitionFromData", () => {
  it("fusionne les rubriques gratuites avec des sauts de page", () => {
    const definition = buildPartialDocDefinitionFromData(
      {
        prealables: {
          type_bien: "Maison",
          maison: { vendue_avec_terrain: true, nature_terrain: "Jardin" },
        },
        identite: {
          identite: { nom: "Doe", prenoms: "Jane", date_naissance: "1990-01-01" },
          etat_civil: {},
        },
      },
      baseLogo
    );

    expect(definition).toBeTruthy();
    expect(definition?.content?.length).toBeGreaterThan(0);
    const pageBreaks =
      definition?.content?.filter((item: any) => item?.pageBreak === "after")
        .length || 0;
    expect(pageBreaks).toBe(1);
    expect(definition?.images?.logoSupernotaire).toBe(baseLogo);
  });

  it("retourne null quand aucune donnée utile n'est présente", () => {
    const definition = buildPartialDocDefinitionFromData(
      { prealables: {}, identite: null as any },
      baseLogo
    );
    expect(definition).toBeNull();
  });
});
