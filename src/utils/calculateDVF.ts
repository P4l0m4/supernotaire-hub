import type { ValeurFonciere } from "@/utils/types/valeur-fonciere";

export interface DvfRecord {
  id: string;
  date_mutation: string;
  adresse_numero: string | null;
  adresse_nom_voie: string | null;
  surface_reelle_bati: number | null;
  nombre_pieces_principales: number | null;
  valeur_fonciere: number | null;
  type_local: string | null;
  surface_terrain: number | null;
}

export interface ValuationOptions {
  year?: string; // année DVF cible, défaut = année courante
  limit?: number; // nombre de mutations visées
  firstYear?: number; // borne basse DVF
}

export interface ValuationResult {
  records: DvfRecord[];
  avgPricePerSqm: number | null; // €/m²
  marketValue: number | null; // avgPricePerSqm * surface
  factors: {
    renovation: number;
    dpe: number;
    downtown: number;
    bonus: number;
    malus: number;
    groundFloor: number;
  };
  estimatedValue: number | null; // arrondi
  landValue?: number | null; // valeur du terrain seul (si maison avec terrain)
  avgLandPricePerSqm?: number | null; // €/m² terrain (si maison avec terrain)
  avgPricePerSqmWithoutLand?: number | null;
}

// ───────────────────────────────────────────────────────────────────────────────

const DATASET =
  "https://public.opendatasoft.com/api/explore/v2.1/catalog/datasets/" +
  "buildingref-france-demande-de-valeurs-foncieres-geolocalisee-millesime/records";

function buildUrl(args: {
  postcode: string;
  typeLocal: ValeurFonciere["configuration"]["type_local"];
  rooms: number;
  land: number;
  year?: string;
  limit: number;
}) {
  const p = new URLSearchParams();
  p.set("limit", String(args.limit));
  p.append("refine", `code_postal:"${args.postcode}"`);
  if (args.year) p.append("refine", `date_mutation:"${args.year}"`);
  if (args.typeLocal) p.append("refine", `type_local:"${args.typeLocal}"`);
  if (args.rooms) p.append("refine", `nombre_pieces_principales:${args.rooms}`);
  // terrain filter: ventes de maison avec terrain vs sans
  if (args.typeLocal === "Maison" && args.land && args.land > 0)
    p.append("where", "surface_terrain > 0");
  else p.append("where", "surface_terrain IS NULL");
  return `${DATASET}?${p.toString()}`;
}

export async function fetchBuildingRecords(
  form: ValeurFonciere,
  { year, limit = 60, firstYear = 2014 }: ValuationOptions = {}
): Promise<DvfRecord[]> {
  const postcode = form.adresse?.properties?.postcode;
  if (!postcode) return [];

  const currentYear = new Date().getFullYear();
  let y = Number(year ?? currentYear);
  if (!Number.isFinite(y)) y = currentYear;

  const out: DvfRecord[] = [];
  while (out.length < limit && y >= (firstYear ?? 2014)) {
    const remaining = limit - out.length;
    const url = buildUrl({
      postcode,
      typeLocal: form.configuration.type_local,
      rooms: form.dimensions.pieces,
      land: form.dimensions.terrain,
      year: String(y),
      limit: remaining,
    });
    const res = await fetch(url);
    if (!res.ok) break;
    const data = await res.json();
    if (Array.isArray(data?.results))
      out.push(...(data.results as DvfRecord[]));
    y--;
  }
  console.log(`Fetched ${out.length} DVF records`);
  return out;
}

// ───────────────────────────────────────────────────────────────────────────────

function avg(list: number[]): number | null {
  if (!list.length) return null;
  return list.reduce((s, v) => s + v, 0) / list.length;
}

export function computeAvgPricePerSqm(records: DvfRecord[]): number | null {
  const perSqm = records
    .map((r) => {
      const price = Number(String(r.valeur_fonciere ?? "").replace(/\s+/g, ""));
      const sqm = Number(r.surface_reelle_bati);
      return Number.isFinite(price) && sqm > 0 ? price / sqm : null;
    })
    .filter((v): v is number => v != null);
  return avg(perSqm);
}

const BONUS: Record<string, { Appartement?: number; Maison?: number }> = {
  terrasse: { Appartement: 4, Maison: 3 },
  balcon: { Appartement: 3 },
  jardin: { Maison: 6 },
  cave: { Appartement: 1, Maison: 1 },
  garage: { Appartement: 2, Maison: 4 },
  parking: { Appartement: 2, Maison: 4 },
  piscine: { Appartement: 5, Maison: 10 },
  ascenseur: { Appartement: 4 },
  interphone: { Appartement: 1 },
  alarme: { Maison: 1 },
  climatisation: { Appartement: 2, Maison: 2 },
  exposition: { Appartement: 2, Maison: 2 },
  tennis: { Appartement: 3, Maison: 6 },
  vue_exceptionnelle: { Appartement: 5, Maison: 5 },
};

export function bonusFactor(
  equipement: string[] | undefined,
  typeLocal: ValeurFonciere["configuration"]["type_local"]
): number {
  if (!equipement?.length) return 1;
  const total = equipement.reduce((sum, key) => {
    const b = BONUS[key]?.[typeLocal];
    return b ? sum + b : sum;
  }, 0);
  return 1 + total / 100;
}

const MALUS: Record<string, { Appartement?: number; Maison?: number }> = {
  ESN: { Appartement: -3, Maison: -3 }, // Espace naturel sensible
  AMH: { Appartement: -3, Maison: -3 }, // Abords de Monument historique
  monument: { Appartement: -8, Maison: -8 }, // Monument historique
  ZIBlue: { Appartement: -6, Maison: -8 }, // Zone inondable bleue
  ZIRed: { Appartement: -12, Maison: -15 }, // Zone inondable rouge
};

export function malusFactor(
  malus: string[] | undefined,
  typeLocal: ValeurFonciere["configuration"]["type_local"]
): number {
  if (!malus?.length) return 1;
  const total = malus.reduce((sum, key) => {
    const m = MALUS[key]?.[typeLocal];
    return m ? sum + m : sum;
  }, 0);
  return 1 + total / 100;
}

export function dpePct(dpe: string): number {
  switch (dpe) {
    case "A":
      return 4;
    case "B":
      return 2;
    case "C":
      return 1;
    case "D":
      return -1;
    case "E":
      return -2;
    case "F":
      return -4;
    case "G":
      return -10;
    default:
      return 0;
  }
}
export const dpeFactor = (dpe: string) => 1 + dpePct(dpe) / 100;

export function groundFloorFactor(
  rdc: boolean,
  typeLocal: ValeurFonciere["configuration"]["type_local"]
): number {
  if (!rdc) return 1;
  return typeLocal === "Appartement" ? 0.92 : 1;
}

export const downtownFactor = (is_downtown: boolean) => (is_downtown ? 1.2 : 1);

export function renovationFactor(travaux: string): number {
  const n = Number(travaux ?? "0");
  return 1 - (Number.isFinite(n) ? n : 0) / 100;
}

// ───────────────────────────────────────────────────────────────────────────────

export async function estimateFromForm(
  form: ValeurFonciere,
  opts?: ValuationOptions
): Promise<ValuationResult> {
  const records = await fetchBuildingRecords(form, opts);
  const avgPricePerSqm = computeAvgPricePerSqm(records);

  const surface = Number(form.dimensions?.surface);

  const marketValue =
    avgPricePerSqm != null && Number.isFinite(surface)
      ? avgPricePerSqm * surface
      : null;

  const factors = {
    renovation: renovationFactor(form.etat.travaux),
    dpe: dpeFactor(form.etat.dpe),
    downtown: downtownFactor(form.is_downtown),
    bonus: bonusFactor(form.configuration.bonus, form.configuration.type_local),
    malus: malusFactor(form.configuration.malus, form.configuration.type_local),
    groundFloor: groundFloorFactor(
      form.configuration.rdc,
      form.configuration.type_local
    ),
  };

  const estimatedValue =
    marketValue == null
      ? null
      : Math.round(
          marketValue *
            factors.renovation *
            factors.dpe *
            factors.downtown *
            factors.bonus *
            factors.malus *
            factors.groundFloor
        );

  let landComparisonRecords: DvfRecord[] = [];
  let avgPricePerSqmWithoutLand: number | null = null;
  let avgLandPricePerSqm: number | null = null;
  let landSurface: number | null = null;
  let landValue: number | null = null;

  if (
    form.configuration.type_local === "Maison" &&
    form.dimensions.terrain &&
    form.dimensions.terrain > 0
  ) {
    landSurface = Number(form.dimensions.terrain);
    // we first fetched records of houses with a terrain. Now we fetch records of houses without terrain to compare.

    const formWithoutLand: ValeurFonciere = {
      ...form,
      dimensions: { ...form.dimensions, terrain: 0 }, // deep clone de ce qu’on modifie
    };
    formWithoutLand.dimensions.terrain = 0; // ignore terrain for main query
    landComparisonRecords = await fetchBuildingRecords(formWithoutLand, {
      ...opts,
      limit: 60,
    });

    avgPricePerSqmWithoutLand = computeAvgPricePerSqm(landComparisonRecords);

    // Here, we calculate the difference of average price per sqm between the two sets of records.

    if (avgPricePerSqm != null && avgPricePerSqmWithoutLand != null) {
      const deltaBuiltEurPerSqm = avgPricePerSqm - avgPricePerSqmWithoutLand; // €/m² habitable
      avgLandPricePerSqm = deltaBuiltEurPerSqm * (surface / landSurface); // €/m² terrain
      const builtSurface = Number(form.dimensions.surface) || 0; // m² habitable du sujet
      landValue = Math.max(0, Math.round(deltaBuiltEurPerSqm * builtSurface)); // € de “prime terrain”
    }
  }

  return {
    records,
    avgPricePerSqm,
    marketValue,
    factors,
    estimatedValue,
    landValue,
    avgLandPricePerSqm,
  };
}
