<script setup lang="ts">
import { computed } from "vue";
import PreEtatDateRubriqueDocuments from "@/components/Pre-etat-date/RubriqueDocuments.vue";
import PreEtatDateRubriqueBien from "@/components/Pre-etat-date/RubriqueBien.vue";
import PreEtatDateRubriqueCopropriete from "@/components/Pre-etat-date/RubriqueCopropriete.vue";
import PreEtatDateRubriqueSyndic from "@/components/Pre-etat-date/RubriqueSyndic.vue";
import PreEtatDateRubriqueFinancierLot from "@/components/Pre-etat-date/RubriqueFinancierLot.vue";
import PreEtatDateRubriqueSommesCedant from "@/components/Pre-etat-date/RubriqueSommesCedant.vue";
import PreEtatDateRubriqueSommesSyndic from "@/components/Pre-etat-date/RubriqueSommesSyndic.vue";
import PreEtatDateRubriqueSommesAcquereur from "@/components/Pre-etat-date/RubriqueSommesAcquereur.vue";
import PreEtatDateRubriqueAutresSommes from "@/components/Pre-etat-date/RubriqueAutresSommes.vue";

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

const componentsMap: Record<SectionParam, any> = {
  documents: PreEtatDateRubriqueDocuments,
  bien: PreEtatDateRubriqueBien,
  copropriete: PreEtatDateRubriqueCopropriete,
  syndic: PreEtatDateRubriqueSyndic,
  financier_lot: PreEtatDateRubriqueFinancierLot,
  financier_lot_sommes_dues_cedant: PreEtatDateRubriqueSommesCedant,
  financier_lot_sommes_debiteur_syndic: PreEtatDateRubriqueSommesSyndic,
  financier_lot_sommes_a_la_charge_acquereur_post_vente:
    PreEtatDateRubriqueSommesAcquereur,
  financier_lot_autres: PreEtatDateRubriqueAutresSommes,
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

const selectedComponent = computed(() => {
  if (!sectionParam.value) return null;
  return componentsMap[sectionParam.value];
});
</script>

<template>
  <Container>
    <JsonLDBreadcrumbs v-if="breadcrumbs?.length" :links="breadcrumbs" />
    <component :is="selectedComponent" v-if="selectedComponent" />
  </Container>

  <HotjarTracking />
</template>
