<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import sommesDuesSyndicDefinition from "@/utils/formDefinition/pre-etat-date/sommes-dues-syndic.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="financier_lot_sommes_debiteur_syndic"
    title="Sommes dues par le Syndic"
    subtitle="Avances et provisions à reverser."
    :form-definition="sommesDuesSyndicDefinition as FormDefinition"
  />
</template>
