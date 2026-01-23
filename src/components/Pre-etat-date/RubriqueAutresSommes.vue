<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import autresSommesDefinition from "@/utils/formDefinition/pre-etat-date/autres-sommes.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="financier_lot_autres"
    title="Autres sommes"
    subtitle="Charges N-1 / N-2 à déclarer."
    :form-definition="autresSommesDefinition as FormDefinition"
  />
</template>
