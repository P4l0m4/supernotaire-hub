<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import {
  getNotariesByCommune,
  getNotariesByDepartement,
  getNotariesByPostalCode,
  type NotaryProfile,
} from "@/utils/notaries";
import type { SupabaseClient } from "@supabase/supabase-js";
import { colors } from "@/utils/colors";
import { stringToSlug } from "@/utils/slugify";

import bannerImage from "@/assets/images/accompagnement-vente-immo-mobile.webp";

type GeoCommune = {
  nom: string;
  code: string; // INSEE
  codeDepartement: string;
  codesPostaux: string[];
};

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const breadcrumbs = [
  {
    name: "Accueil",
    url: "/",
  },
  {
    name: "Annuaire",
    url: `${baseUrl}/annuaire`,
  },
];

const query = ref("");
const pending = ref(false);
const errorMessage = ref<string | null>(null);
const geoLocationErrorMessage = ref<string | null>(null);
const notaries = ref<NotaryProfile[]>([]);
const locationLabel = ref<string | null>(null);
const geoGouvCommunes = ref<GeoCommune[]>([]);
// cache la dernière recherche pour restauration au retour arrière
const searchState = useState("annuaireSearch", () => ({
  query: "",
  locationLabel: null as string | null,
  notaries: [] as NotaryProfile[],
  geoGouvCommunes: [] as GeoCommune[],
}));

type Suggestion = { codePostal: string; label: string; insee: string };
const searchSuggestions = computed<Suggestion[]>(() => {
  if (!geoGouvCommunes.value?.length) return [];
  const out: Suggestion[] = [];
  const seen = new Set<string>();
  for (const c of geoGouvCommunes.value) {
    for (const cp of c.codesPostaux) {
      const key = `${c.code}-${cp}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push({
        codePostal: cp,
        insee: c.code,
        label: `${c.nom} (${cp})`,
      });
    }
  }
  return out;
});

const placeholder = computed(() => "Paris, 73000, 74…");
const showEmptyState = computed(
  () =>
    !pending.value &&
    !errorMessage.value &&
    notaries.value.length === 0 &&
    query.value.trim().length > 0,
);

const { $supabase } = useNuxtApp();
const supabaseClient = $supabase as SupabaseClient | null;

// Utils
const DIGITS = /^\d+$/;
const RX_DEPT = /^\d{2,3}$/; // 01..95, 2A/2B exclus car instruction “nombres”, DOM 971..976 ok
const RX_POSTAL = /^\d{5}$/;

function normalizeText(s: string) {
  return s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

type Mode = "departement" | "postal" | "text" | "invalid";
function inferMode(raw: string): Mode {
  const v = raw.trim();
  if (!v) return "invalid";
  if (DIGITS.test(v)) {
    if (RX_POSTAL.test(v)) return "postal";
    if (RX_DEPT.test(v)) return "departement";
    return "invalid";
  }
  return "text";
}

function mergeBySiret(lists: NotaryProfile[][]) {
  const map = new Map<string, NotaryProfile>();
  for (const n of lists.flat()) if (!map.has(n.siret)) map.set(n.siret, n);
  return Array.from(map.values());
}

async function resolveGeoGouvByName(name: string): Promise<GeoCommune[]> {
  const q = normalizeText(name);
  if (!q) return [];
  const url =
    `https://geo.api.gouv.fr/communes` +
    `?nom=${encodeURIComponent(q)}` +
    `&fields=nom,code,codeDepartement,codesPostaux` +
    `&boost=population&limit=5`;
  const res = await $fetch<GeoCommune[]>(url);
  geoGouvCommunes.value = Array.isArray(res) ? res : [];
  return geoGouvCommunes.value;
}

// anti race condition
let reqId = 0;

async function fetchNotaries(raw: string, forcedLabel?: string) {
  const id = ++reqId;

  errorMessage.value = null;
  locationLabel.value = null;

  const mode = inferMode(raw);
  if (mode === "invalid") {
    notaries.value = [];
    geoGouvCommunes.value = [];
    return;
  }
  if (!supabaseClient) {
    errorMessage.value = "Supabase n'est pas initialisé.";
    return;
  }

  pending.value = true;
  try {
    let data: NotaryProfile[] = [];

    if (mode === "departement") {
      const dept = raw.trim();
      data = await getNotariesByDepartement(supabaseClient, dept);
      locationLabel.value = `${dept}`;
      geoGouvCommunes.value = [];
    } else if (mode === "postal") {
      const cp = raw.trim();
      data = await getNotariesByPostalCode(supabaseClient, cp);
      locationLabel.value = `${forcedLabel ?? `${query.value} (${cp})`}`;
      geoGouvCommunes.value = [];
    } else {
      // mode === "text" : chercher communes via GeoGouv
      const communes = await resolveGeoGouvByName(raw);
      if (id !== reqId) return; // abandon si requête plus récente

      if (!communes.length) {
        notaries.value = [];
        locationLabel.value = null;
        return;
      }

      // Un seul lieu -> requêtes directes
      if (communes.length === 1) {
        const c = communes[0];
        // Priorité au code postal principal si présent, sinon fallback commune
        if (c.codesPostaux?.length) {
          const results = await Promise.all(
            c.codesPostaux.map((cp) =>
              getNotariesByPostalCode(supabaseClient, cp),
            ),
          );
          data = mergeBySiret(results);
          locationLabel.value = `${c.nom} (${c.codeDepartement})`;
        } else {
          data = await getNotariesByCommune(supabaseClient, c.nom);
          locationLabel.value = `${c.nom} (${c.codeDepartement})`;
        }
      } else {
        // Plusieurs lieux -> suggestions par code postal
        data = [];
        locationLabel.value = `Affinez votre recherche`;
      }
    }

    if (id !== reqId) return;
    notaries.value = data;
    // persist pour navigation arrière
    searchState.value = {
      query: query.value,
      locationLabel: locationLabel.value,
      notaries: data,
      geoGouvCommunes: geoGouvCommunes.value,
    };
  } catch (err: any) {
    if (id !== reqId) return;
    console.error(err);
    notaries.value = [];
    errorMessage.value =
      err?.message ?? "Impossible de récupérer les notaires pour cette zone.";
  } finally {
    if (id === reqId) pending.value = false;
  }
}

function clearSearch() {
  query.value = "";
  notaries.value = [];
  geoGouvCommunes.value = [];
  errorMessage.value = null;
  locationLabel.value = null;
  searchState.value = {
    query: "",
    locationLabel: null,
    notaries: [],
    geoGouvCommunes: [],
  };
}

async function fetchNearbyNotaries() {
  pending.value = true;
  const nearbyLocation = await getNearbyLocation();
  if (nearbyLocation?.status === "success") {
    await fetchNotaries(nearbyLocation.postcode, nearbyLocation.city);
  } else if (nearbyLocation?.status === "error") {
    geoLocationErrorMessage.value = nearbyLocation.message;
  }
  pending.value = false;
}

async function getNearbyLocation() {
  if (!navigator.geolocation) {
    return {
      status: "error" as const,
      message: "Géolocalisation non supportée par ce navigateur.",
    };
  }

  return new Promise<
    | { status: "success"; city: string; postcode: string }
    | { status: "error"; message: string }
  >((resolve) => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const url =
            `https://api-adresse.data.gouv.fr/reverse/` +
            `?lon=${longitude}&lat=${latitude}` +
            `&limit=1`;
          const res = await $fetch<any>(url);
          const features = res?.features;
          if (Array.isArray(features) && features.length > 0) {
            const props = features[0].properties;
            const city = props.city;
            const postcode = props.postcode;

            resolve({ status: "success" as const, city, postcode });
          } else {
            resolve({
              status: "error" as const,
              message: "Aucune adresse trouvée pour votre position.",
            });
          }
        } catch (err: any) {
          console.error(err);
          resolve({
            status: "error" as const,
            message:
              err?.message ??
              "Impossible de récupérer l'adresse depuis votre position.",
          });
        }
      },
      (error) => {
        console.error(error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            resolve({
              status: "error" as const,
              message:
                "Permission de géolocalisation refusée sur votre navigateur.",
            });
            break;
          case error.POSITION_UNAVAILABLE:
            resolve({
              status: "error" as const,
              message: "Position indisponible.",
            });
            break;
          case error.TIMEOUT:
            resolve({
              status: "error" as const,
              message: "Délai de géolocalisation dépassé.",
            });
            break;
          default:
            resolve({
              status: "error" as const,
              message: "Erreur de géolocalisation inconnue.",
            });
        }
      },
    );
  });
}

useJsonld({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Annuaire des meilleurs notaires",
  description:
    "Trouvez les meilleurs notaires près de chez vous. Consultez le classement des études notariales par département et commune.",
  url: `${useRuntimeConfig().public.baseURL}/annuaire`,
});

watch(query, (v) => {
  if (!v.trim()) {
    clearSearch();
  }
});

onMounted(() => {
  // hydrate depuis le cache si présent
  if (searchState.value.query || searchState.value.notaries.length) {
    query.value = searchState.value.query;
    locationLabel.value = searchState.value.locationLabel;
    geoGouvCommunes.value = searchState.value.geoGouvCommunes;
    notaries.value = searchState.value.notaries;
  }
});
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
    <div class="annuaire">
      <div class="headlines">
        <h1 class="headlines__title">
          Trouvez les meilleurs notaires près de chez vous
        </h1>
        <h2 class="headlines__subtitle paragraphs">
          Consultez le classement des études notariales par département et
          commune.
        </h2>
      </div>

      <div class="annuaire__controls">
        <FormElementsSearchBar
          v-model="query"
          :placeholder="placeholder"
          @search="fetchNotaries(query)"
        />
        <div class="annuaire__hint">
          <span>Cherchez un notaire par code postal ou commune.</span>

          <UITertiaryButton
            @click="fetchNearbyNotaries"
            @keydown.enter="fetchNearbyNotaries"
            @keydown.space="fetchNearbyNotaries"
            variant="secondary-color"
            icon="map_pin"
            style="margin-left: auto"
            >Votre position</UITertiaryButton
          >
        </div>

        <ul
          v-if="searchSuggestions.length"
          class="search-suggestions"
          role="listbox"
        >
          <li
            v-for="s in searchSuggestions"
            :key="`${s.insee}-${s.codePostal}`"
            class="search-suggestions__item"
          >
            <button
              type="button"
              @click="fetchNotaries(s.codePostal, s.label)"
              @keydown.enter="fetchNotaries(s.codePostal, s.label)"
              @keydown.space="fetchNotaries(s.codePostal, s.label)"
              :aria-label="`Rechercher ${s.label}`"
            >
              {{ s.label }}
            </button>
          </li>
        </ul>
      </div>
      <UITagComponent
        v-if="pending"
        :color="colors['accent-color']"
        icon="circle_notch_bold"
        size="big"
      >
        Recherche en cours…</UITagComponent
      >
      <UITagComponent
        v-if="errorMessage"
        :color="colors['error-color']"
        icon="alert_circle"
        size="big"
      >
        {{ errorMessage }}</UITagComponent
      >
      <UITagComponent
        v-if="showEmptyState"
        :color="colors['warning-color']"
        icon="help_circle"
        size="big"
      >
        Aucun résultat pour "{{ locationLabel }}". Réessayez avec d'autres
        termes de recherche.</UITagComponent
      >
      <UITagComponent
        v-if="notaries.length"
        :color="colors['accent-color']"
        icon="search"
        size="big"
      >
        {{ notaries.length }} notaires(s) trouvé(s) pour
        {{ locationLabel }}</UITagComponent
      >
      <UINotificationModal
        v-if="geoLocationErrorMessage"
        :progress-color="colors['error-color']"
        ><UIActionToast
          icon="x_circle"
          :color="colors['error-color']"
          direction="row"
          >{{ geoLocationErrorMessage }}</UIActionToast
        ></UINotificationModal
      >

      <ul
        v-if="!pending && !errorMessage && notaries.length"
        class="annuaire__list"
      >
        <li
          v-for="(n, i) in notaries"
          :key="n.siret"
          class="annuaire__list__card"
        >
          <NuxtLink
            :to="`/annuaire/${stringToSlug(n.denomination)}-${n.siret}`"
            :aria-label="`Voir le profil de ${n.denomination}`"
          >
            <SearchResultCard
              :title="n.denomination"
              :subtitle="n.matchedName ? n.matchedName : ''"
              :corner-icon="i === 0 ? 'trophy_fill' : ''"
              :corner-color="i === 0 ? colors['success-color'] : ''"
            >
              <UIStarsRating
                :rating="n.rating || 0"
                :totalRatings="n.userRatingsTotal || 0"
                :color="
                  n.rating && n.userRatingsTotal
                    ? colors['warning-color']
                    : colors['text-color-faded']
                "
              />

              <UITagComponent
                v-if="n.matchedAddr && n.confidence && n.confidence > 0.5"
                icon="map_pin_fill"
                :color="colors['accent-color']"
              >
                {{ n.matchedAddr }}</UITagComponent
              >
              <UITagComponent
                v-else
                icon="map_pin_fill"
                :color="
                  i === 0 ? colors['success-color'] : colors['accent-color']
                "
              >
                {{ n.adresse }}, {{ n.codePostal }} {{ n.commune }}
                {{ n.departement }}</UITagComponent
              ></SearchResultCard
            ></NuxtLink
          >
        </li>
      </ul>
    </div>
  </Container>
  <Container
    ><ImageBanner
      title="Reprenez le contrôle de votre temps 🧘"
      subtitle="Réduisez intelligemment votre charge de travail, sans compromis sur l’accompagnement."
      link-path="/inscription"
      link-label="Découvrir la solution"
      :image-path="bannerImage"
      :perks="[
        {
          title: 'Automatisations intelligentes',
          icon: 'sparkle',
        },
        {
          title: 'Dossiers complets et organisés',
          icon: 'list_checks',
        },
        {
          title: 'Gain de temps immédiat',
          icon: 'clock_countdown',
        },
      ]"
  /></Container>
  <HotjarTracking />
</template>

<style scoped lang="scss">
.annuaire {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

  &__controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
    width: 100%;
    max-width: 50rem;
    position: relative;

    .search-suggestions {
      display: flex;
      flex-direction: column;
      color: $text-color;
      width: 100%;
      height: fit-content;
      top: 3.6rem;
      left: 0;
      list-style: none;
      background-color: $primary-color;
      border:
        1px solid color-mix(in srgb, $text-color) 10%,
        transparent;
      position: absolute;
      overflow: hidden;
      border-radius: calc($radius / 2);
      max-height: 10rem;
      overflow-y: scroll;

      &__item {
        height: fit-content;
        transition: background-color 0.2s linear;

        & button {
          color: $text-color;
          width: clamp(100%, 100%, 100%);
          height: clamp(100%, 100%, 100%);
          padding: 1rem;
          text-align: left;
          background: none;
          cursor: pointer;
          border: none;
          font-family: "Inter", sans-serif;
          font-size: 1rem;
        }

        &:hover {
          background-color: color-mix(in srgb, $accent-color 10%, transparent);
          cursor: pointer;
        }
      }
    }
  }

  &__hint {
    display: flex;
    flex-direction: column;
    color: $text-color-faded;
    font-size: $small-text;
    width: 100%;
    gap: 1rem;

    @media (min-width: $big-tablet-screen) {
      flex-direction: row;
      align-items: center;
    }
  }

  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(288px, 1fr));
    gap: 1rem;
    list-style: none;

    > :first-child {
      grid-column: 1 / -1;
    }
  }
}
</style>
