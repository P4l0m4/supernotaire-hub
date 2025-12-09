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
  confidence: number | null;
  rating: number | null;
  userRatingsTotal: number | null;
}

type EtablissementRow = {
  siret: string;
  denomination: string;
  adresse: string;
  codePostal: string;
  commune: string;
  departement: string;
  PlaceMatch?:
    | {
        placeId: string;
        matchedName: string | null;
        matchedAddr: string | null;
        confidence: number | null;
      }
    | Array<{
        placeId: string;
        matchedName: string | null;
        matchedAddr: string | null;
        confidence: number | null;
      }>;
};

const SELECT_FIELDS = `
  siret,
  denomination,
  adresse,
  codePostal,
  commune,
  departement,
  PlaceMatch!inner (
    placeId,
    matchedName,
    matchedAddr,
    confidence
  )
`;

function normalizeMatch(rowMatch: EtablissementRow["PlaceMatch"]) {
  if (!rowMatch) return null;
  return Array.isArray(rowMatch) ? rowMatch[0] ?? null : rowMatch;
}

function sortByRating(a: NotaryProfile, b: NotaryProfile) {
  const ratingA = a.rating ?? -1;
  const ratingB = b.rating ?? -1;
  if (ratingA !== ratingB) return ratingB - ratingA;

  const votesA = a.userRatingsTotal ?? 0;
  const votesB = b.userRatingsTotal ?? 0;
  if (votesA !== votesB) return votesB - votesA;

  return a.denomination.localeCompare(b.denomination);
}

async function fetchRatings(
  supabase: SupabaseClient,
  placeIds: string[]
): Promise<Map<string, { rating: number | null; userRatingsTotal: number | null }>> {
  if (!placeIds.length) return new Map();

  const { data, error } = await supabase
    .from("PlaceRating")
    .select("placeId, rating, userRatingsTotal")
    .in("placeId", placeIds);

  if (error) {
    throw new Error(`Supabase error while reading PlaceRating: ${error.message}`);
  }

  const ratingByPlaceId = new Map<string, { rating: number | null; userRatingsTotal: number | null }>();
  (data ?? []).forEach((row) => {
    ratingByPlaceId.set(row.placeId, {
      rating: row.rating ?? null,
      userRatingsTotal: row.userRatingsTotal ?? null,
    });
  });

  return ratingByPlaceId;
}

async function fetchEtablissements(
  supabase: SupabaseClient,
  filter: { departement?: string; commune?: string; codePostal?: string }
) {
  let query = supabase.from("Etablissement").select(SELECT_FIELDS);

  if (filter.departement) {
    query = query.eq("departement", filter.departement);
  }

  if (filter.commune) {
    query = query.ilike("commune", `${filter.commune}%`);
  }

  if (filter.codePostal) {
    query = query.eq("codePostal", filter.codePostal);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Supabase error while reading Etablissement: ${error.message}`);
  }

  return (data ?? []) as EtablissementRow[];
}

async function getNotaries(
  supabase: SupabaseClient,
  filter: { departement?: string; commune?: string; codePostal?: string }
): Promise<NotaryProfile[]> {
  const rows = await fetchEtablissements(supabase, filter);
  const placeIds = rows
    .map((row) => normalizeMatch(row.PlaceMatch)?.placeId)
    .filter((id): id is string => Boolean(id));

  const ratingByPlaceId = await fetchRatings(supabase, placeIds);

  const notaries = rows.map((row) => {
    const match = normalizeMatch(row.PlaceMatch);
    const rating = match ? ratingByPlaceId.get(match.placeId) : undefined;

    return {
      siret: row.siret,
      denomination: row.denomination,
      adresse: row.adresse,
      codePostal: row.codePostal,
      commune: row.commune,
      departement: row.departement,
      matchedName: match?.matchedName ?? null,
      matchedAddr: match?.matchedAddr ?? null,
      confidence: match?.confidence ?? null,
      rating: rating?.rating ?? null,
      userRatingsTotal: rating?.userRatingsTotal ?? null,
    };
  });

  return notaries.sort(sortByRating);
}

export async function getNotariesByDepartement(
  supabase: SupabaseClient,
  departement: string
) {
  if (!departement.trim()) return [];
  return getNotaries(supabase, { departement: departement.trim() });
}

export async function getNotariesByCommune(supabase: SupabaseClient, commune: string) {
  if (!commune.trim()) return [];
  return getNotaries(supabase, { commune: commune.trim() });
}

export async function getNotariesByPostalCode(
  supabase: SupabaseClient,
  codePostal: string
) {
  const value = codePostal.trim();
  if (!value) return [];
  return getNotaries(supabase, { codePostal: value });
}
