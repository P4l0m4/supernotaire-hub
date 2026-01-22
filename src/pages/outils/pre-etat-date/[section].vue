<script setup lang="ts">
import { computed } from "vue";
import { PreEtatDateGenerateurPED } from "#components";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "";
const route = useRoute();

const validSections = [
  "documents",
  "bien",
  "copropriete",
  "syndic",
  "financier_lot",
  "financier_lot_sommes_dues_cedant",
  "financier_lot_sommes_debiteur_syndic",
  "financier_lot_sommes_a_la_charge_acquereur_post_vente",
  "financier_lot_autres",
] as const;

type SectionParam = (typeof validSections)[number];

const labels: Record<SectionParam, string> = {
  documents: "Justificatifs",
  bien: "Bien à vendre",
  copropriete: "Copropriété",
  syndic: "Syndic",
  financier_lot: "Situation financière du lot",
  financier_lot_sommes_dues_cedant: "Sommes dues par le cédant",
  financier_lot_sommes_debiteur_syndic: "Sommes dues par le Syndic",
  financier_lot_sommes_a_la_charge_acquereur_post_vente:
    "Sommes à la charge acquéreur",
  financier_lot_autres: "Autres sommes",
};

const sectionParam = computed<SectionParam | null>(() => {
  const raw = String(route.params.section || "");
  return validSections.includes(raw as SectionParam)
    ? (raw as SectionParam)
    : null;
});

if (!sectionParam.value && process.client) {
  navigateTo("/outils/pre-etat-date");
}

const breadcrumbs = computed(() => [
  { name: "Accueil", url: "/" },
  { name: "Outils", url: "/outils" },
  { name: "Pré-état daté", url: "/outils/pre-etat-date" },
  {
    name: sectionParam.value ? labels[sectionParam.value] : "Pré-état daté",
    url: `${baseUrl}/outils/pre-etat-date/${sectionParam.value || ""}`,
  },
]);

useHead({
  title: `Pré-état daté | ${
    sectionParam.value ? labels[sectionParam.value] : "Pré-état daté"
  }`,
  meta: [
    {
      name: "description",
      content: `Complétez la rubrique ${
        sectionParam.value ? labels[sectionParam.value] : ""
      } pour générer votre pré-état daté.`,
    },
  ],
});
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs?.length" :links="breadcrumbs" />
    <div class="rubrique">
      <div class="rubrique__header">
        <h1 class="titles">
          {{ sectionParam ? labels[sectionParam] : "Pré-état daté" }}
        </h1>
        <p class="subtitles">
          Complétez les informations de cette rubrique. Vos données restent
          stockées localement.
        </p>
      </div>

      <div class="rubrique__actions">
        <NuxtLink to="/outils/pre-etat-date" aria-label="Retour aux rubriques">
          <UITertiaryButton icon="arrow_left" direction="row-reverse">
            Retour aux rubriques
          </UITertiaryButton>
        </NuxtLink>
      </div>
      <div class="rubrique__form">
        <PreEtatDateGenerateurPED
          v-if="sectionParam"
          :section-id="sectionParam"
        />
      </div></div
  ></Container>

  <HotjarTracking />
</template>

<style scoped lang="scss">
.rubrique {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  width: 100%;

  @media (min-width: $laptop-screen) {
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
  }

  &__header {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    text-wrap: balance;
  }

  &__actions {
    display: flex;
    flex-direction: column;
    align-items: end;
    height: fit-content;
    gap: 1rem;
    margin-top: 1rem;
    grid-row: 3;

    @media (min-width: $laptop-screen) {
      grid-column: 1;
      grid-row: 2;
      flex-direction: row;
      justify-content: space-between;
      align-items: start;
    }
  }

  &__form {
    grid-column: 1 / -1;

    @media (min-width: $laptop-screen) {
      grid-column: 2;
      grid-row: 1 / -1;
    }
  }
}
</style>
