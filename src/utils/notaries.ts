import type { SupabaseClient } from "@supabase/supabase-js";

export interface NotaryProfile {
  siret: string;
  denomination: string;
  adresse: string;
  codePostal: string;
  commune: string;
  departement: string;
  matchedName: string | null;
  matchedAddr: string | null;
  nationalPhoneNumber: string | null;
  website: string | null;
  confidence: number | null;
  rating: number | null;
  userRatingsTotal: number | null;
}

type PlaceRatingRow = {
  rating: number | null;
  userRatingsTotal: number | null;
};

type PlaceMatchRow = {
  placeId: string;
  matchedName: string | null;
  matchedAddr: string | null;
  nationalPhoneNumber: string | null;
  websiteUri: string | null;
  confidence: number | null;
  // peut être objet ou tableau selon PostgREST
  PlaceRating?: PlaceRatingRow | PlaceRatingRow[] | null;
};

// réponse brute Supabase (PlaceMatch peut aussi être tableau)
type EtablissementRowRaw = {
  siret: string;
  denomination: string;
  adresse: string;
  codePostal: string;
  commune: string;
  departement: string;
  PlaceMatch?: PlaceMatchRow | PlaceMatchRow[] | null;
};

const SELECT_FIELDS = `
  siret, denomination, adresse, codePostal, commune, departement,
  PlaceMatch (
    placeId, matchedName, matchedAddr, nationalPhoneNumber, websiteUri, confidence,
    PlaceRating ( rating, userRatingsTotal )
  )
`;

function sortByRating(a: NotaryProfile, b: NotaryProfile) {
  const rA = a.rating ?? -1;
  const rB = b.rating ?? -1;
  if (rA !== rB) return rB - rA;
  const vA = a.userRatingsTotal ?? 0;
  const vB = b.userRatingsTotal ?? 0;
  if (vA !== vB) return vB - vA;
  return a.denomination.localeCompare(b.denomination);
}

const first = <T>(v: T | T[] | null | undefined): T | null =>
  Array.isArray(v) ? v[0] ?? null : v ?? null;

async function fetchEtablissements(
  supabase: SupabaseClient,
  filter: { departement?: string; commune?: string; codePostal?: string },
  page = { from: 0, to: 199 }
) {
  let q = supabase.from("Etablissement").select(SELECT_FIELDS);

  if (filter.departement) q = q.eq("departement", filter.departement);
  if (filter.commune) q = q.ilike("commune", `%${filter.commune}%`);
  if (filter.codePostal) q = q.eq("codePostal", filter.codePostal);

  // PlaceMatch le mieux scoré
  q = q
    .order("confidence", {
      foreignTable: "PlaceMatch",
      ascending: false,
      nullsFirst: true,
    })
    .limit(1, { foreignTable: "PlaceMatch" });

  q = q.order("departement").order("commune").order("denomination");

  const { data, error } = await q
    .range(page.from, page.to)
    .returns<EtablissementRowRaw[]>();
  if (error)
    throw new Error(
      `Supabase error while reading Etablissement: ${error.message}`
    );
  return data ?? [];
}

async function getNotaries(
  supabase: SupabaseClient,
  filter: { departement?: string; commune?: string; codePostal?: string }
): Promise<NotaryProfile[]> {
  const rows = await fetchEtablissements(supabase, filter);

  const notaries = rows.map((row) => {
    const match = first(row.PlaceMatch);
    const pr = first(match?.PlaceRating);

    return {
      siret: row.siret,
      denomination: row.denomination,
      adresse: row.adresse,
      codePostal: row.codePostal,
      commune: row.commune,
      departement: row.departement,
      matchedName: match?.matchedName ?? null,
      matchedAddr: match?.matchedAddr ?? null,
      nationalPhoneNumber: match?.nationalPhoneNumber ?? null,
      website: match?.websiteUri ?? null,
      confidence: match?.confidence ?? null,
      rating: pr?.rating ?? null,
      userRatingsTotal: pr?.userRatingsTotal ?? null,
    };
  });

  return notaries.sort(sortByRating);
}

export async function getNotariesByDepartement(
  supabase: SupabaseClient,
  departement: string
) {
  const v = departement.trim();
  if (!v) return [];
  return getNotaries(supabase, { departement: v });
}

export async function getNotariesByCommune(
  supabase: SupabaseClient,
  commune: string
) {
  const v = commune.trim();
  if (!v) return [];
  return getNotaries(supabase, { commune: v });
}

export async function getNotariesByPostalCode(
  supabase: SupabaseClient,
  codePostal: string
) {
  const v = codePostal.trim();
  if (!v) return [];
  return getNotaries(supabase, { codePostal: v });
}
