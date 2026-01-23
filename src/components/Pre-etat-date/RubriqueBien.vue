<script setup lang="ts">
import PreEtatDateRubriqueBase from "@/components/Pre-etat-date/RubriqueBase.vue";
import bienDefinition from "@/utils/formDefinition/pre-etat-date/bien.json";
import type { FormDefinition } from "@/types/forms";
</script>

<template>
  <PreEtatDateRubriqueBase
    section-id="bien"
    title="Bien à vendre"
    subtitle="Adresse et identification du lot."
    :form-definition="bienDefinition as FormDefinition"
  />
</template>
