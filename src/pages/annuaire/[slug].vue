<script setup lang="ts">
import { computed, ref, watchEffect, onMounted } from "vue";
import { useRoute } from "#app";
import type { SupabaseClient } from "@supabase/supabase-js";
import { colors } from "@/utils/colors";
import { getNotariesByPostalCode, type NotaryProfile } from "@/utils/notaries";

const route = useRoute();
const { $supabase } = useNuxtApp();
const supabaseClient = $supabase as SupabaseClient | null;

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
  siret: string,
): Promise<NotaryProfile | null> {
  const SELECT_FIELDS = `
    siret, denomination, adresse, codePostal, commune, departement,
    PlaceMatch (
      placeId, matchedName, matchedAddr, nationalPhoneNumber, websiteUri, confidence,
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
    ? (data.PlaceMatch[0] ?? null)
    : (data.PlaceMatch ?? null);
  const pr = place?.PlaceRating
    ? Array.isArray(place.PlaceRating)
      ? (place.PlaceRating[0] ?? null)
      : place.PlaceRating
    : null;

  const out: NotaryProfile = {
    siret: data.siret,
    denomination: data.denomination,
    adresse: data.adresse,
    codePostal: data.codePostal,
    commune: data.commune,
    departement: data.departement,
    matchedName: place?.matchedName ?? "",
    matchedAddr: place?.matchedAddr ?? "",
    nationalPhoneNumber: place?.nationalPhoneNumber ?? "",
    website: place?.websiteUri ?? "",
    confidence: place?.confidence ?? "",
    rating: pr?.rating ?? "",
    userRatingsTotal: pr?.userRatingsTotal ?? "",
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

    // mode "name" seul: fallback minimal - LIKE côté serveur pour la dénomination
    // (cas non couvert par les helpers existants)
    const SELECT_FIELDS = `
      siret, denomination, adresse, codePostal, commune, departement,
      PlaceMatch (
        placeId, matchedName, matchedAddr, nationalPhoneNumber, websiteUri, confidence,
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
        ? (row.PlaceMatch[0] ?? null)
        : (row.PlaceMatch ?? null);
      const pr = place?.PlaceRating
        ? Array.isArray(place.PlaceRating)
          ? (place.PlaceRating[0] ?? null)
          : place.PlaceRating
        : null;
      return {
        siret: row.siret,
        denomination: row.denomination,
        adresse: row.adresse,
        codePostal: row.codePostal,
        commune: row.commune,
        departement: row.departement,
        matchedName: place?.matchedName ?? "",
        matchedAddr: place?.matchedAddr ?? "",
        nationalPhoneNumber: place?.nationalPhoneNumber ?? "",
        website: place?.websiteUri ?? "",
        confidence: place?.confidence ?? "",
        rating: pr?.rating ?? "",
        userRatingsTotal: pr?.userRatingsTotal ?? "",
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
    : profile.value?.denomination || "Profil du notaire",
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
  const tel = profile.value?.nationalPhoneNumber?.replace(/\s+/g, "") || "";
  return tel ? `tel:${tel}` : "";
});
const websiteHref = computed(() => {
  let url = profile.value?.website?.trim?.() || "";
  if (!url) return "";
  if (!/^https?:\/\//i.test(url)) url = "https://" + url;
  return url;
});
const fromDepartement = computed(() => {
  const v = route.query.from;
  if (Array.isArray(v)) return v.includes("departement");
  return v === "departement";
});
const departementSlug = computed(() => {
  const v = route.query.departement;
  if (Array.isArray(v)) return v[0] || "";
  return typeof v === "string" ? v : "";
});
const returnHref = computed(() =>
  departementSlug.value
    ? `/annuaire/departement/${departementSlug.value}`
    : fromDepartement.value
      ? "/annuaire/departement"
      : "/annuaire",
);
const returnLabel = computed(() => `Retour au classement`);

useJsonld(() => {
  const p = profile.value;
  if (!p) return null;
  const runtimeConfig = useRuntimeConfig();
  const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";
  const url = `${baseUrl}/annuaire/${rawSlug.value}`;
  const name = titleText.value;

  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name,
    description: `Profil et classement de ${name} - Notaire à ${p.commune}, ${p.departement}.`,
    url,
  };
});

useHead(() => {
  const name = titleText.value;
  const addr = addrText.value;
  const rating =
    profile.value?.rating && profile.value?.userRatingsTotal
      ? ` - Note ${profile.value.rating} (${profile.value.userRatingsTotal} avis)`
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

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const breadcrumbs = [
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
    url: `${baseUrl}/annuaire/${rawSlug.value}`,
  },
];
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
    <div class="notary-profile">
      <div class="notary-profile__header">
        <h1 class="notary-profile__header__title">{{ titleText }}</h1>
        <UIStarsRating
          :rating="profile?.rating || 0"
          :totalRatings="profile?.userRatingsTotal || 0"
          :color="
            profile?.rating && profile?.userRatingsTotal
              ? colors['warning-color']
              : `${colors['text-color']}70`
          "
        />
      </div>

      <div class="notary-profile__grid">
        <div class="notary-profile__grid__main">
          <div class="grid-card">
            <h2 class="grid-card__title">Coordonnées de l'étude notariale</h2>
            <div class="grid-card__actions">
              <NuxtLink
                v-if="websiteHref?.length"
                class="ui-link"
                :to="websiteHref"
                target="_blank"
                rel="noopener"
                v-tooltip="'Visiter le site web du notaire'"
              >
                <UIIconComponent
                  icon="globe"
                  :color="colors['secondary-color']"
                />

                {{ profile?.website }}
              </NuxtLink>
              <span v-else class="ui-link ui-link--disabled"
                ><UIIconComponent
                  icon="globe"
                  :color="colors['secondary-color']"
                /><UISkeletonLoader
                  v-if="websiteHref === null"
                  height="1.25rem"
                />
                <template v-if="websiteHref === ''">
                  Pas de site web disponible</template
                >
              </span>
            </div>
            <div class="grid-card__actions">
              <NuxtLink
                v-if="telHref?.length"
                class="ui-link"
                :to="telHref"
                target="_blank"
                rel="noopener"
                v-tooltip="'Appeler le notaire'"
              >
                <UIIconComponent
                  icon="phone"
                  :color="colors['secondary-color']"
                />

                {{ profile?.nationalPhoneNumber }}
              </NuxtLink>
              <span v-else class="ui-link ui-link--disabled">
                <UIIconComponent
                  icon="phone"
                  :color="colors['secondary-color']"
                />

                <UISkeletonLoader v-if="telHref === null" height="1.25rem" />
                <template v-if="telHref === ''">
                  Aucun numéro disponible
                </template>
              </span>
            </div>
            <div class="grid-card__actions">
              <NuxtLink
                v-if="mapsUrl?.length"
                class="ui-link"
                :to="mapsUrl"
                target="_blank"
                rel="noopener"
                v-tooltip="'Voir sur Google Maps'"
                ><UIIconComponent
                  icon="map_trifold"
                  :color="colors['secondary-color']"
                />

                {{ addrText }}
              </NuxtLink>
              <span v-else class="ui-link ui-link--disabled">
                <UISkeletonLoader v-if="mapsUrl === null" height="1.25rem" />
                <template v-if="mapsUrl === ''">
                  Pas d'adresse disponible
                </template>
              </span>
            </div>
            <div class="grid-card__actions">
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
              <UISkeletonLoader v-else height="1.25rem" />
            </div>
          </div>
        </div>

        <aside class="notary-profile__grid__side">
          <div class="grid-card">
            <h2 class="grid-card__title">Informations complémentaires</h2>
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
  <Container>
    <NuxtLink :to="returnHref" aria-label="Retour">
      <UITertiaryButton
        variant="secondary-color"
        icon="arrow_left"
        direction="row-reverse"
      >
        {{ returnLabel }}
      </UITertiaryButton>
    </NuxtLink>
  </Container>
</template>

<style scoped lang="scss">
.notary-profile {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  width: 100%;

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;

    &__title {
      font-size: clamp(1.5rem, 2.4vw, 2rem);
      margin: 0;
    }
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

  .grid-card {
    background: $primary-color;
    border-radius: calc($radius / 2);
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;

    &__title {
      font-size: 1.25rem;
      font-weight: $regular;
    }

    &__actions {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
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
    }

    &__k {
      color: rgba($text-color, 0.7);
    }
    &__v {
      color: $text-color;
    }
  }

  .ui-link {
    text-decoration: none;
    display: flex;
    align-items: center;
    gap: 0.5rem;

    &--disabled {
      opacity: 0.6;
      pointer-events: none;
    }
  }
}
</style>
