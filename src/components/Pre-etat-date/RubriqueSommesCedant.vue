<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import sommesDuesCedantDefinition from "@/utils/formDefinition/pre-etat-date/sommes-dues-cedant.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="financier_lot_sommes_dues_cedant"
    title="Sommes dues par le cédant"
    subtitle="Montants et avances à régulariser côté vendeur."
    :form-definition="sommesDuesCedantDefinition as FormDefinition"
  />
</template>
