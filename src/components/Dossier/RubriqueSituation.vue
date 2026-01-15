<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import situationFormDefinition from "@/utils/formDefinition/checklist-situation-matrimoniale.json";
import { buildDocDefinition as buildSituationDocDefinition } from "@/utils/docDefinitions/checklist-situation-matrimoniale";
</script>

<template>
  <RubriqueBase
    sectionId="situation"
    title="Situation matrimoniale"
    storageKey="sn-checklist-situation"
    pdfPrefix="situation-matrimoniale"
    :formDefinition="situationFormDefinition"
    :docBuilder="buildSituationDocDefinition"
  />
</template>
