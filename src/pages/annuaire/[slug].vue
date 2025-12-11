<script setup lang="ts">
import { computed, ref, watchEffect, onMounted } from "vue";
import { useRoute, useRouter } from "#app";
import type { SupabaseClient } from "@supabase/supabase-js";
import { colors } from "@/utils/colors";
import { getNotariesByPostalCode, type NotaryProfile } from "@/utils/notaries";

const route = useRoute();
const router = useRouter();
const { $supabase } = useNuxtApp();
const supabaseClient = $supabase as SupabaseClient | null;

const breadcrumbs = ref();

const pending = ref(true);
const errorMessage = ref<string | null>(null);
const profile = ref<NotaryProfile | null>(null);

// --- slug parsing
const rawSlug = computed(() => String(route.params.slug || ""));
const RX_SIRET = /(\d{14})/;
const RX_POSTAL = /\b(\d{5})\b/;

type SlugParse =
  | { mode: "siret"; siret: string }
  | { mode: "namePostal"; name: string; postal: string }
  | { mode: "name"; name: string };

function normalizeText(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
function parseSlug(slug: string): SlugParse {
  const m = slug.match(RX_SIRET);
  if (m) return { mode: "siret", siret: m[1] };
  if (slug.includes("--")) {
    const [left, right] = slug.split("--");
    const cp = right.match(RX_POSTAL)?.[1] || "";
    const name = normalizeText(decodeURIComponent(left));
    if (cp) return { mode: "namePostal", name, postal: cp };
  }
  return { mode: "name", name: normalizeText(decodeURIComponent(slug)) };
}

// --- fetchers
// Cas SIRET: on lit directement Etablissement + PlaceMatch + PlaceRating
async function getOneBySiret(
  supabase: SupabaseClient,
  siret: string
): Promise<NotaryProfile | null> {
  const SELECT_FIELDS = `
    siret, denomination, adresse, codePostal, commune, departement,
    PlaceMatch (
      placeId, matchedName, matchedAddr, confidence,
      PlaceRating ( rating, userRatingsTotal )
    )
  `;
  const { data, error } = await supabase
    .from("Etablissement")
    .select(SELECT_FIELDS)
    .eq("siret", siret)
    // meilleur match en tête + 1 seul
    .order("confidence", {
      foreignTable: "PlaceMatch",
      ascending: false,
      nullsFirst: true,
    })
    .limit(1, { foreignTable: "PlaceMatch" })
    .maybeSingle();

  if (error) throw new Error(`Supabase error: ${error.message}`);
  if (!data) return null;

  const place = Array.isArray(data.PlaceMatch)
    ? data.PlaceMatch[0] ?? null
    : data.PlaceMatch ?? null;
  const pr = place?.PlaceRating
    ? Array.isArray(place.PlaceRating)
      ? place.PlaceRating[0] ?? null
      : place.PlaceRating
    : null;

  const out: NotaryProfile = {
    siret: data.siret,
    denomination: data.denomination,
    adresse: data.adresse,
    codePostal: data.codePostal,
    commune: data.commune,
    departement: data.departement,
    matchedName: place?.matchedName ?? null,
    matchedAddr: place?.matchedAddr ?? null,
    confidence: place?.confidence ?? null,
    rating: pr?.rating ?? null,
    userRatingsTotal: pr?.userRatingsTotal ?? null,
  };
  return out;
}

// Ressemble deux chaînes en "score pauvre mais suffisant" pour départager
function scoreName(haystack: string, needle: string) {
  const a = normalizeText(haystack).toLowerCase();
  const b = normalizeText(needle).toLowerCase();
  if (!b) return 0;
  if (a === b) return 10;
  if (a.includes(b)) return 8;
  // bonus par mots
  const words = b.split(" ").filter(Boolean);
  let s = 0;
  for (const w of words) if (a.includes(w)) s += 1;
  return Math.min(7, s);
}

async function fetchNotary() {
  errorMessage.value = null;
  profile.value = null;

  if (!supabaseClient) {
    errorMessage.value = "Supabase n'est pas initialisé.";
    pending.value = false;
    return;
  }

  const parsed = parseSlug(rawSlug.value);

  try {
    pending.value = true;

    if (parsed.mode === "siret") {
      const one = await getOneBySiret(supabaseClient, parsed.siret);
      if (!one) {
        errorMessage.value = "Aucun notaire trouvé pour ce SIRET.";
        return;
      }
      profile.value = one;
      return;
    }

    if (parsed.mode === "namePostal") {
      const list = await getNotariesByPostalCode(supabaseClient, parsed.postal);
      if (!list.length) {
        errorMessage.value = "Aucun notaire pour ce code postal.";
        return;
      }
      // meilleur match sur denomination
      const ranked = [...list].sort((a, b) => {
        const sb = scoreName(b.denomination, parsed.name);
        const sa = scoreName(a.denomination, parsed.name);
        return (
          sb - sa ||
          (b.rating ?? -1) - (a.rating ?? -1) ||
          (b.userRatingsTotal ?? 0) - (a.userRatingsTotal ?? 0)
        );
      });
      profile.value = ranked[0];
      return;
    }

    // mode "name" seul: fallback minimal — on tente un LIKE côté serveur pour la dénomination
    // (cas non couvert par les helpers existants)
    const SELECT_FIELDS = `
      siret, denomination, adresse, codePostal, commune, departement,
      PlaceMatch (
        placeId, matchedName, matchedAddr, confidence,
        PlaceRating ( rating, userRatingsTotal )
      )
    `;
    const { data, error } = await supabaseClient
      .from("Etablissement")
      .select(SELECT_FIELDS)
      .ilike("denomination", `%${parsed.name}%`)
      .order("confidence", {
        foreignTable: "PlaceMatch",
        ascending: false,
        nullsFirst: true,
      })
      .limit(1, { foreignTable: "PlaceMatch" })
      .limit(20);

    if (error) throw new Error(error.message);
    if (!data?.length) {
      errorMessage.value = "Aucun notaire ne correspond à ce nom.";
      return;
    }
    // mappe en NotaryProfile comme pour SIRET puis prend le meilleur
    const candidates: NotaryProfile[] = data.map((row: any) => {
      const place = Array.isArray(row.PlaceMatch)
        ? row.PlaceMatch[0] ?? null
        : row.PlaceMatch ?? null;
      const pr = place?.PlaceRating
        ? Array.isArray(place.PlaceRating)
          ? place.PlaceRating[0] ?? null
          : place.PlaceRating
        : null;
      return {
        siret: row.siret,
        denomination: row.denomination,
        adresse: row.adresse,
        codePostal: row.codePostal,
        commune: row.commune,
        departement: row.departement,
        matchedName: place?.matchedName ?? null,
        matchedAddr: place?.matchedAddr ?? null,
        confidence: place?.confidence ?? null,
        rating: pr?.rating ?? null,
        userRatingsTotal: pr?.userRatingsTotal ?? null,
      };
    });

    candidates.sort((a, b) => {
      const sb = scoreName(b.denomination, parsed.name);
      const sa = scoreName(a.denomination, parsed.name);
      return (
        sb - sa ||
        (b.rating ?? -1) - (a.rating ?? -1) ||
        (b.userRatingsTotal ?? 0) - (a.userRatingsTotal ?? 0)
      );
    });
    profile.value = candidates[0];
  } catch (err: any) {
    console.error(err);
    errorMessage.value =
      err?.message ?? "Impossible de récupérer la fiche notaire.";
  } finally {
    pending.value = false;
  }
}

watchEffect(fetchNotary);

const titleText = computed(() =>
  profile.value?.matchedName
    ? profile.value?.matchedName
    : profile.value?.denomination || "Profil du notaire"
);

const addrText = computed(() => {
  const n = profile.value;
  if (!n) return "";
  if (n.matchedAddr && n.confidence && n.confidence > 0.5) return n.matchedAddr;
  const parts = [
    n.adresse,
    [n.codePostal, n.commune].filter(Boolean).join(" "),
    n.departement,
  ].filter(Boolean);
  return parts.join(", ");
});

const mapsUrl = computed(() => {
  const n = profile.value;
  if (!n) return null;
  const q = encodeURIComponent(`${n.denomination} ${addrText.value}`);
  return `https://www.google.com/maps/search/?api=1&query=${q}`;
});
const telHref = computed(() => {
  const tel =
    (profile.value?.telephone as any as string | undefined)?.replace?.(
      /\s+/g,
      ""
    ) || "";
  return tel ? `tel:${tel}` : null;
});
const websiteHref = computed(() => {
  let url = (profile.value as any)?.website?.trim?.() || "";
  if (!url) return null;
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return url;
});

// SEO
useHead(() => {
  const name = titleText.value;
  const addr = addrText.value;
  const rating =
    profile.value?.rating && profile.value?.userRatingsTotal
      ? ` — Note ${profile.value.rating} (${profile.value.userRatingsTotal} avis)`
      : "";
  const title = `${name}${rating} | Annuaire des notaires de ${profile.value?.departement}`;
  const description = addr ? `${name} - ${addr}.` : name;
  return {
    title,
    meta: [
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
    ],
  };
});

onMounted(() => {
  breadcrumbs.value = [
    {
      name: "Accueil",
      url: "/",
    },
    {
      name: "Annuaire",
      url: "/annuaire",
    },
    {
      name: titleText.value,
      url: window.location.href,
    },
  ];
});
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
    <div class="fiche">
      <div class="fiche__head">
        <h1 class="fiche__title">{{ titleText }}</h1>
        <UIStarsRating
          :rating="profile?.rating || 0"
          :totalRatings="profile?.userRatingsTotal || 0"
          :color="
            profile?.rating && profile?.userRatingsTotal
              ? colors['warning-color']
              : colors['text-color-faded']
          "
        />
      </div>

      <div class="fiche__grid">
        <section class="fiche__main">
          <div class="fiche__card">
            <h2 class="fiche__section-title">
              Coordonnées de l'étude notariale
            </h2>

            <div class="fiche__actions">
              <a
                v-if="mapsUrl"
                class="ui-link"
                :href="mapsUrl"
                target="_blank"
                rel="noopener"
                v-tooltip="'Voir sur Google Maps'"
              >
                <UITertiaryButton icon="map_trifold" variant="secondary-color">
                  {{ addrText }}
                </UITertiaryButton>
              </a>
              <UISkeletonLoader v-else height="1.25rem" />
            </div>
            <div class="fiche__actions">
              <UITagComponent
                v-if="profile?.confidence != null"
                icon="check_circle"
                :color="
                  profile.confidence > 0.5
                    ? colors['success-color']
                    : colors['warning-color']
                "
              >
                Confiance de correspondance :
                {{ Math.round((profile.confidence || 0) * 100) }}%
              </UITagComponent>
            </div>
          </div>
        </section>

        <aside class="fiche__side">
          <div class="fiche__card">
            <h2 class="fiche__section-title">Informations complémentaires</h2>
            <ul class="kv">
              <li>
                <span class="kv__k">Dénomination</span>
                <span class="kv__v" v-if="profile?.denomination.length">{{
                  profile.denomination
                }}</span>
                <UISkeletonLoader v-else height="1rem" />
              </li>
              <li>
                <span class="kv__k">SIRET</span>
                <span class="kv__v" v-if="profile?.siret.length">{{
                  profile.siret
                }}</span>
                <UISkeletonLoader v-else height="1rem" />
              </li>
              <li>
                <span class="kv__k">Siège social</span>
                <span class="kv__v" v-if="profile?.adresse.length">{{
                  profile.adresse
                }}</span>
                <UISkeletonLoader v-else height="1rem" />
              </li>
              <li>
                <span class="kv__k">Commune</span>
                <span class="kv__v" v-if="profile?.commune.length">{{
                  profile.commune
                }}</span>
                <UISkeletonLoader v-else height="1rem" />
              </li>

              <li>
                <span class="kv__k">Code postal</span>
                <span class="kv__v" v-if="profile?.codePostal">{{
                  profile.codePostal
                }}</span>
                <UISkeletonLoader v-else height="1rem" />
              </li>
              <li>
                <span class="kv__k">Département</span>
                <span class="kv__v" v-if="profile?.departement.length">{{
                  profile.departement
                }}</span>
                <UISkeletonLoader v-else height="1rem" />
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  </Container>
</template>

<style scoped lang="scss">
.fiche {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  &__head {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__title {
    font-size: clamp(1.5rem, 2.4vw, 2rem);
    margin: 0;
  }

  &__grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 1rem;
    width: 100%;

    @media (min-width: $big-tablet-screen) {
      grid-template-columns: 2fr 1fr;
      gap: 1.5rem;
    }
  }

  &__card {
    background: $primary-color;
    border-radius: calc($radius / 2);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__section-title {
    font-size: 1.25rem;
    font-weight: $regular;
  }

  .kv {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    > li {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      @media (min-width: $big-tablet-screen) {
        flex-direction: row;
        align-items: center;
      }
    }

    &__k {
      color: $text-color-faded;
    }
    &__v {
      color: $text-color;
    }
  }

  .ui-link {
    text-decoration: none;
  }

  .fiche__actions {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
}
</style>
