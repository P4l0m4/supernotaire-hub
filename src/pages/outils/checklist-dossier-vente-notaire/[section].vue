<script setup lang="ts">
import RubriquePrealables from "@/components/Dossier/RubriquePrealables.vue";
import RubriqueIdentite from "@/components/Dossier/RubriqueIdentite.vue";
import RubriqueSituation from "@/components/Dossier/RubriqueSituation.vue";
import RubriqueChargesTaxes from "@/components/Dossier/RubriqueChargesTaxes.vue";
import RubriqueCopro from "@/components/Dossier/RubriqueCopro.vue";
import RubriqueOccupation from "@/components/Dossier/RubriqueOccupation.vue";
import RubriqueOrigine from "@/components/Dossier/RubriqueOrigine.vue";
import RubriqueCapacite from "@/components/Dossier/RubriqueCapacite.vue";
import RubriqueProFiscale from "@/components/Dossier/RubriqueProFiscale.vue";
import RubriqueUrbanisme from "@/components/Dossier/RubriqueUrbanisme.vue";
import RubriqueDiagnosticsTravauxInterieurs from "@/components/Dossier/RubriqueDiagnosticsTravauxInterieurs.vue";

const runtimeConfig = useRuntimeConfig();
const baseUrl = runtimeConfig.public?.baseURL;
const route = useRoute();

const validSections = [
  "prealables",
  "identite",
  "situation",
  "charges-taxes",
  "copro",
  "occupation",
  "origine",
  "capacite",
  "pro-fiscale",
  "urbanisme",
  "diagnostics-travaux-interieurs",
] as const;

type SectionParam = (typeof validSections)[number];

const sectionParam = computed<SectionParam | null>(() => {
  const raw = String(route.params.section || "");
  return validSections.includes(raw as SectionParam)
    ? (raw as SectionParam)
    : null;
});

if (!sectionParam.value && process.client) {
  navigateTo("/outils/checklist-dossier-vente-notaire");
}

const sectionLabels: Record<SectionParam, string> = {
  prealables: "Informations préalables",
  identite: "Identité & État civil",
  situation: "Situation matrimoniale",
  "charges-taxes": "Charges & Taxes",
  copro: "Copropriété & Structures collectives",
  occupation: "Occupation actuelle",
  origine: "Origine de propriété",
  capacite: "Capacité & Représentation",
  "pro-fiscale": "Situation professionnelle & Fiscale",
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
  "pro-fiscale": RubriqueProFiscale,
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
    <component v-if="sectionParam && currentComponent" :is="currentComponent" />
    <NuxtLink
      to="/outils/checklist-dossier-vente-notaire"
      aria-label="Retourner aux rubriques"
      style="margin-left: auto"
    >
      <UITertiaryButton icon="arrow_left" direction="row-reverse"
        >Retourner aux rubriques</UITertiaryButton
      ></NuxtLink
    >
  </Container>
  <HotjarTracking />
</template>
