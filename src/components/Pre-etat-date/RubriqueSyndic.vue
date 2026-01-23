<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import syndicDefinition from "@/utils/formDefinition/pre-etat-date/syndic.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="syndic"
    title="Syndic"
    subtitle="Coordonnées et références du syndic."
    :form-definition="syndicDefinition as FormDefinition"
  />
</template>
