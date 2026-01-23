<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import coproprieteDefinition from "@/utils/formDefinition/pre-etat-date/copropriete.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="copropriete"
    title="Copropriété"
    subtitle="Données générales sur la copropriété."
    :form-definition="coproprieteDefinition as FormDefinition"
  />
</template>
