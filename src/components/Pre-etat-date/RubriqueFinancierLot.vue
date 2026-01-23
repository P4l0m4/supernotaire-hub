<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import situationFinanciereLotDefinition from "@/utils/formDefinition/pre-etat-date/situation-financiere-lot.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="financier_lot"
    title="Situation financière du lot"
    subtitle="Appels, soldes et échéances à venir."
    :form-definition="situationFinanciereLotDefinition as FormDefinition"
  />
</template>
