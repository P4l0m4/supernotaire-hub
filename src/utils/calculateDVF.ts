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
  avgPricePerSqmCarrez: number | null; // €/m²
  avgPricePerSqmBatie: number | null; // €/m²
  marketValue: number | null; // avgPricePerSqm * surface
  factors: {
    renovation: number;
    dpe: number;
    downtown: number;
    bonus: number;
    malus: number;
    groundFloor: number;
  };
  inhabitantsNb: number | null;
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
  const postcode = form.localisation.adresse?.properties?.postcode;
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

  return out;
}

// ───────────────────────────────────────────────────────────────────────────────

function avg(list: number[]): number | null {
  if (!list.length) return null;
  return list.reduce((s, v) => s + v, 0) / list.length;
}

export function computeAvgPricePerSqm(records: DvfRecord[]): number | null {
  const rows = records
    .map((r) => {
      const price = Number(String(r.valeur_fonciere ?? "").replace(/\s+/g, ""));
      const sqm = Number(r.surface_reelle_bati);
      return price > 0 && Number.isFinite(sqm) && sqm > 0
        ? { price, sqm, unit: price / sqm }
        : null;
    })
    .filter((x): x is { price: number; sqm: number; unit: number } => !!x);

  if (!rows.length) return null;

  // trim 10% bas/haut sur le €/m²
  rows.sort((a, b) => a.unit - b.unit);
  const cut = Math.floor(rows.length * 0.1);
  const trimmed =
    rows.length > 2 * cut ? rows.slice(cut, rows.length - cut) : rows;

  // moyenne robuste = (∑prix) / (∑m²)
  const totalPrice = trimmed.reduce((s, r) => s + r.price, 0);
  const totalSqm = trimmed.reduce((s, r) => s + r.sqm, 0);
  return totalSqm > 0 ? totalPrice / totalSqm : null;
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

let inhabitantsNb: number | null = null;

async function fetchInhabitantsNb(postcode: string, citycode: string) {
  const res = await fetch(
    `https://geo.api.gouv.fr/communes?codePostal=${postcode}&code=${citycode}`
  );
  const data = await res.json();
  inhabitantsNb = data[0].population;
  return data[0].population;
}

export async function downtownFactor(
  is_downtown: boolean,
  postcode: string,
  citycode: string
): Promise<number> {
  const inhabitants = await fetchInhabitantsNb(postcode, citycode);

  if (inhabitants < 10000) {
    return 1;
  }
  return is_downtown ? 1.2 : 1;
}

export function renovationFactor(travaux: string): number {
  const n = Number(travaux ?? "0");
  return 1 - (Number.isFinite(n) ? n : 0) / 100;
}

function toNum(x: any) {
  const n = Number(x);
  return Number.isFinite(n) ? n : NaN;
}
function parsePrice(x: any) {
  return Number(String(x ?? "").replace(/\s+/g, ""));
}
function median(a: number[]) {
  const b = [...a].sort((x, y) => x - y);
  const m = Math.floor(b.length / 2);
  return b.length % 2 ? b[m] : (b[m - 1] + b[m]) / 2;
}

// 1) €/m² bâti: prends des maisons avec peu de terrain pour minimiser l'effet terrain
function estimateBuiltUnit(
  records: DvfRecord[],
  lowLandMax = 100
): number | null {
  const rows = records
    .map((r) => ({
      price: parsePrice(r.valeur_fonciere),
      built: toNum(r.surface_reelle_bati),
      land: Math.max(0, toNum(r.surface_terrain)),
    }))
    .filter((r) => r.price > 0 && r.built > 0);
  const lowLand = rows.filter((r) => r.land > 0 && r.land <= lowLandMax);
  const base = lowLand.length >= 8 ? lowLand : rows; // fallback si pas assez
  if (!base.length) return null;
  const unit = base.map((r) => r.price / r.built).sort((a, b) => a - b);
  // trimming simple
  const k = Math.floor(unit.length * 0.1);
  const trimmed = unit.slice(k, unit.length - k);
  return trimmed.length
    ? trimmed.reduce((s, v) => s + v, 0) / trimmed.length
    : null;
}

// 2) €/m² terrain: médiane des résiduels par m² de terrain
function estimateLandUnit(
  records: DvfRecord[],
  builtUnit: number
): number | null {
  const vals = records
    .map((r) => {
      const price = parsePrice(r.valeur_fonciere);
      const built = toNum(r.surface_reelle_bati);
      const land = Math.max(0, toNum(r.surface_terrain));
      if (!(price > 0 && built > 0 && land > 0)) return null;
      const residual = price - builtUnit * built;
      return residual > 0 ? residual / land : null; // €/m² terrain
    })
    .filter((v): v is number => v != null);
  if (vals.length < 8) return null;
  // médiane robuste
  return Math.max(0, median(vals));
}

// ───────────────────────────────────────────────────────────────────────────────

export async function estimateFromForm(
  form: ValeurFonciere,
  opts?: ValuationOptions
): Promise<ValuationResult> {
  const records = await fetchBuildingRecords(form, opts);

  const avgPricePerSqmBatie = computeAvgPricePerSqm(records);

  const surfaceBatie = Number(form.dimensions?.surface);
  const surfaceCarrez = Number(form.dimensions?.surface_habitable);

  const ratioBatiToCarrez =
    Number.isFinite(surfaceBatie) &&
    Number.isFinite(surfaceCarrez) &&
    surfaceCarrez > 0
      ? surfaceBatie / surfaceCarrez
      : null;

  const avgPricePerSqmCarrez =
    avgPricePerSqmBatie != null && ratioBatiToCarrez != null
      ? avgPricePerSqmBatie * ratioBatiToCarrez
      : null;

  const marketValue =
    avgPricePerSqmCarrez != null && Number.isFinite(surfaceCarrez)
      ? avgPricePerSqmCarrez * surfaceCarrez
      : null;

  const factors = {
    renovation: renovationFactor(form.etat.travaux),
    dpe: dpeFactor(form.etat.dpe),
    downtown: await downtownFactor(
      form.is_downtown,
      form.localisation.adresse?.properties?.postcode!,
      form.localisation.adresse?.properties?.citycode!
    ),
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

  let avgLandPricePerSqm: number | null = null;
  let landValue: number | null = null;

  if (
    form.configuration.type_local === "Maison" &&
    form.dimensions.terrain &&
    form.dimensions.terrain > 0
  ) {
    const landSurface = Number(form.dimensions.terrain);

    const builtUnit =
      estimateBuiltUnit(records) ?? computeAvgPricePerSqm(records);
    if (builtUnit != null) {
      const landUnit = estimateLandUnit(records, builtUnit);
      if (landUnit != null) {
        // abattement terrain -20 %
        avgLandPricePerSqm = landUnit * 0.8;
        landValue = Math.round(avgLandPricePerSqm * landSurface);
      }
    }
  }

  return {
    records,
    avgPricePerSqmCarrez,
    avgPricePerSqmBatie,
    marketValue,
    factors,
    inhabitantsNb,
    estimatedValue,
    landValue,
    avgLandPricePerSqm,
  };
}
