<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import occupationFormDefinition from "@/utils/formDefinition/checklist-occupation-actuelle.json";
import { buildDocDefinition as buildOccupationDocDefinition } from "@/utils/docDefinitions/checklist-occupation-actuelle";
</script>

<template>
  <RubriqueBase
    sectionId="occupation"
    title="Occupation actuelle"
    storageKey="sn-checklist-occupation"
    pdfPrefix="occupation-actuelle"
    :formDefinition="occupationFormDefinition"
    :docBuilder="buildOccupationDocDefinition"
    :requireAccess="true"
  />
</template>
