<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import identiteFormDefinition from "@/utils/formDefinition/checklist-identite-etat-civil.json";
import { buildDocDefinition as buildIdentiteDocDefinition } from "@/utils/docDefinitions/checklist-identite-etat-civil";
</script>

<template>
  <RubriqueBase
    sectionId="identite"
    title="Identité & État civil"
    storageKey="sn-checklist-identite"
    pdfPrefix="identite-etat-civil"
    :formDefinition="identiteFormDefinition"
    :docBuilder="buildIdentiteDocDefinition"
  />
</template>
