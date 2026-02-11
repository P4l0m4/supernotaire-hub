<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { useRoute } from "#app";
import { colors } from "@/utils/colors";
import { stringToSlug } from "@/utils/slugify";
import { notariesPages } from "@/utils/notariesPages";

import type { SupabaseClient } from "@supabase/supabase-js";
import { getNotariesByDepartement, type NotaryProfile } from "@/utils/notaries";

const route = useRoute();
const { $supabase } = useNuxtApp();
const supabaseClient = $supabase as SupabaseClient | null;

const pending = ref(true);
const errorMessage = ref<string | null>(null);
const notaries = ref<NotaryProfile[]>([]);

const rawSlug = computed(() => String(route.params.slug || "").trim());
const slugKey = computed(() => {
  const v = rawSlug.value;
  if (!v) return "";
  return v.startsWith("/") ? v : `/${v}`;
});
const pageConfig = computed(() =>
  notariesPages.find((p) => p.slug === slugKey.value),
);

const RX_DEPT = /(\d{2,3})$/;
const fallbackDepartement = computed(() => {
  const m = rawSlug.value.match(RX_DEPT);
  return m ? m[1] : "";
});
const departementCode = computed(
  () => pageConfig.value?.departementCode || fallbackDepartement.value,
);

const titleText = computed(
  () =>
    pageConfig.value?.title ||
    (departementCode.value
      ? `Meilleurs notaires du département ${departementCode.value}`
      : "Meilleurs notaires par département"),
);
const descriptionText = computed(
  () =>
    pageConfig.value?.description ||
    (departementCode.value
      ? `Découvrez les notaires du département ${departementCode.value}, classés par avis clients.`
      : "Découvrez les notaires classés par avis clients."),
);
const departementLabel = computed(
  () =>
    pageConfig.value?.departementLabel ||
    (departementCode.value
      ? `dans le département ${departementCode.value}`
      : "dans ce département"),
);
const departementName = computed(
  () => pageConfig.value?.departementName || departementCode.value,
);
const locationLabel = computed(() =>
  departementLabel.value ? departementLabel.value : "",
);
const showEmptyState = computed(
  () =>
    !pending.value &&
    !errorMessage.value &&
    notaries.value.length === 0 &&
    departementCode.value.length > 0,
);
const fromDepartement = computed(() => {
  const v = route.query.from;
  if (Array.isArray(v)) return v.includes("departement");
  return v === "departement";
});
const returnHref = computed(() =>
  fromDepartement.value ? "/annuaire/departement" : "/annuaire",
);
const returnLabel = computed(() =>
  fromDepartement.value ? "Retour aux départements" : "Retour à l'annuaire",
);

const faqQuestions = computed(() => {
  const label = departementLabel.value || "dans ce département";
  const count = notaries.value.length;
  const countAnswer = count
    ? `Nous listons actuellement ${count} notaire(s) ${label}.`
    : `Le nombre de notaires ${label} varie. La liste est mise à jour régulièrement.`;

  return [
    {
      title: `Combien y a-t-il de notaires ${label} ?`,
      answer: countAnswer,
    },
    {
      title: `Comment est établi le classement des notaires ${label} ?`,
      answer:
        "Le classement se base sur les notes et le volume des avis clients lorsqu'ils sont disponibles. L'ordre peut évoluer avec les nouveaux avis clients présents sur leurs fiches Google. Lorsqu'aucun avis n'est disponible, les notaires sont listés par ordre alphabétique.",
    },
    {
      title: `Comment contacter un notaire ${label} ?`,
      answer:
        "Chaque fiche notaire affiche les coordonnées suivantes lorsqu'elles sont disponibles : adresse, téléphone et site internet. Cliquez sur une fiche pour accéder aux informations disponibles un notaire ou une étude notariale spécifique.",
    },
    {
      title: `Puis-je prendre rendez-vous avec un notaire ${label} ?`,
      answer:
        "La prise de rendez-vous se fait directement avec l'étude, via les coordonnées indiquées sur la fiche de chaque notaire ou étude notariale.",
    },
  ];
});

async function fetchNotariesByDepartement(code: string) {
  errorMessage.value = null;
  notaries.value = [];

  if (!code) {
    pending.value = false;
    return;
  }

  if (!supabaseClient && process.client) {
    errorMessage.value = "La BDD n'est pas initialisée.";
    pending.value = false;
    return;
  }

  pending.value = true;
  try {
    if (!supabaseClient && process.client) {
      throw new Error("La BDD n'est pas initialisée.");
    }
    notaries.value = await getNotariesByDepartement(supabaseClient!, code);
  } catch (err: any) {
    console.error(err);
    errorMessage.value =
      err?.message ??
      "Impossible de récupérer les notaires pour ce département.";
  } finally {
    pending.value = false;
  }
}

watch(
  departementCode,
  (v) => {
    fetchNotariesByDepartement(v);
  },
  { immediate: true },
);

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "https://easycase.fr";

const breadcrumbs = computed(() => [
  {
    name: "Accueil",
    url: "/",
  },
  {
    name: "Annuaire",
    url: `${baseUrl}/annuaire`,
  },
  {
    name: departementName.value
      ? `Notaires ${departementLabel.value}`
      : "Departement",
    url: `${baseUrl}/annuaire/departement/${rawSlug.value}`,
  },
]);

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: titleText.value,
  description: descriptionText.value,
  url: `${baseUrl}/annuaire/departement/${rawSlug.value}`,
}));

useJsonld(() => ({
  "@context": "https://schema.org",
  "@type": "FAQPage" as const,
  mainEntity: faqQuestions.value.map((question) => ({
    "@type": "Question" as const,
    name: question.title,
    acceptedAnswer: {
      "@type": "Answer" as const,
      text: question.answer,
    },
  })),
}));

useHead(() => ({
  title: `${titleText.value} | Annuaire des notaires`,
  meta: [
    { name: "description", content: descriptionText.value },
    { property: "og:title", content: titleText.value },
    { property: "og:description", content: descriptionText.value },
  ],
}));
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs" :links="breadcrumbs" />
    <div class="annuaire-dep">
      <div class="headlines">
        <h1 class="headlines__title">{{ titleText }}</h1>
        <h2 class="headlines__subtitle paragraphs">
          {{ descriptionText }}
        </h2>
      </div>

      <UITagComponent
        v-if="pending"
        :color="colors['accent-color']"
        icon="circle_notch_bold"
        size="big"
      >
        Recherche en cours...
      </UITagComponent>
      <UITagComponent
        v-if="errorMessage"
        :color="colors['error-color']"
        icon="alert_circle"
        size="big"
      >
        {{ errorMessage }}
      </UITagComponent>
      <UITagComponent
        v-if="showEmptyState"
        :color="colors['warning-color']"
        icon="help_circle"
        size="big"
      >
        Aucun resultat {{ locationLabel }}.
      </UITagComponent>
      <UITagComponent
        v-if="notaries.length"
        :color="colors['accent-color']"
        icon="search"
        size="big"
      >
        {{ notaries.length }} notaire(s) trouvé(s) {{ locationLabel }}.
      </UITagComponent>

      <ul
        v-if="!pending && !errorMessage && notaries.length"
        class="annuaire-dep__list"
      >
        <li
          v-for="(n, i) in notaries"
          :key="n.siret"
          class="annuaire-dep__list__card"
        >
          <NuxtLink
            :to="`/annuaire/${stringToSlug(n.denomination)}-${
              n.siret
            }?from=departement&departement=${rawSlug}`"
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
                    : `${colors['text-color']}70`
                "
              />

              <UITagComponent
                v-if="n.matchedAddr && n.confidence && n.confidence > 0.5"
                icon="map_pin_fill"
                :color="colors['accent-color']"
              >
                {{ n.matchedAddr }}
              </UITagComponent>
              <UITagComponent
                v-else
                icon="map_pin_fill"
                :color="
                  i === 0 ? colors['success-color'] : colors['accent-color']
                "
              >
                {{ n.adresse }}, {{ n.codePostal }} {{ n.commune }}
                {{ n.departement }}
              </UITagComponent>
            </SearchResultCard>
          </NuxtLink>
        </li>
      </ul>
    </div>
  </Container>
  <Container v-if="faqQuestions.length">
    <div class="faq">
      <h3 class="faq__title">
        Questions frequentes sur les notaires {{ locationLabel }}
      </h3>
      <FAQComponent :questions="faqQuestions" />
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

<style lang="scss" scoped>
.annuaire-dep {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;

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
