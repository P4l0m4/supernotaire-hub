<script setup lang="ts">
import { ref, computed, watchEffect } from "vue";
import { preEtatDateSections } from "@/utils/preEtatDateSections";
import RubriquePrealables from "@/components/Dossier/RubriquePrealables.vue";
import RubriqueIdentite from "@/components/Dossier/RubriqueIdentite.vue";
import RubriqueSituation from "@/components/Dossier/RubriqueSituation.vue";
import RubriqueChargesTaxes from "@/components/Dossier/RubriqueChargesTaxes.vue";
import RubriqueCopro from "@/components/Dossier/RubriqueCopro.vue";
import RubriqueOccupation from "@/components/Dossier/RubriqueOccupation.vue";
import RubriqueOrigine from "@/components/Dossier/RubriqueOrigine.vue";
import RubriqueCapacite from "@/components/Dossier/RubriqueCapacite.vue";
import RubriqueFiscale from "@/components/Dossier/RubriqueFiscale.vue";
import RubriqueUrbanisme from "@/components/Dossier/RubriqueUrbanisme.vue";
import RubriqueDiagnosticsTravauxInterieurs from "@/components/Dossier/RubriqueDiagnosticsTravauxInterieurs.vue";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL || "";
const route = useRoute();

type SectionParam = (typeof preEtatDateSections)[number];

const sectionParam = computed<SectionParam | null>(() => {
  const raw = String(route.params.section || "");
  return preEtatDateSections.includes(raw as SectionParam)
    ? (raw as SectionParam)
    : null;
});

watchEffect(() => {
  if (!sectionParam.value && process.client) {
    navigateTo("/outils/checklist-dossier-vente-notaire");
  }
});

const sectionLabels: Record<SectionParam, string> = {
  prealables: "Informations préalables",
  identite: "Identité & État civil",
  situation: "Situation matrimoniale",
  "charges-taxes": "Charges & Taxes",
  copro: "Copropriété & Structures collectives",
  occupation: "Occupation actuelle",
  origine: "Origine de propriété",
  capacite: "Capacité & Représentation",
  fiscale: "Situation fiscale",
  urbanisme: "Urbanisme & Travaux extérieurs",
  "diagnostics-travaux-interieurs": "Diagnostics & Travaux intérieurs",
};

const componentMap: Record<SectionParam, any> = {
  prealables: RubriquePrealables,
  identite: RubriqueIdentite,
  situation: RubriqueSituation,
  "charges-taxes": RubriqueChargesTaxes,
  copro: RubriqueCopro,
  occupation: RubriqueOccupation,
  origine: RubriqueOrigine,
  capacite: RubriqueCapacite,
  fiscale: RubriqueFiscale,
  urbanisme: RubriqueUrbanisme,
  "diagnostics-travaux-interieurs": RubriqueDiagnosticsTravauxInterieurs,
};

const currentComponent = computed(() =>
  sectionParam.value ? componentMap[sectionParam.value] : null,
);

const breadcrumbs = ref([
  {
    name: "Accueil",
    url: "/",
  },
  {
    name: "Outils",
    url: "/outils",
  },
  {
    name: "Rubriques",
    url: `/outils/checklist-dossier-vente-notaire`,
  },
  {
    name: sectionParam.value ? sectionLabels[sectionParam.value] : "Checklist",
    url: `${baseUrl}/outils/checklist-dossier-vente-notaire/${
      sectionParam.value || ""
    }`,
  },
]);

useHead({
  title: `EasyCase | ${
    sectionParam.value ? sectionLabels[sectionParam.value] : "Checklist"
  }`,
  meta: [
    {
      name: "description",
      content: `Complétez la rubrique ${sectionParam.value ? sectionLabels[sectionParam.value] : ""} en répondant à quelques questions simples.`,
    },
  ],
});
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs?.length" :links="breadcrumbs" />
    <component
      v-if="currentComponent && typeof currentComponent !== 'string'"
      :is="currentComponent"
    />
  </Container>

  <HotjarTracking />
</template>
