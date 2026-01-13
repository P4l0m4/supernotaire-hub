<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import proFiscaleFormDefinition from "@/utils/formDefinition/checklist-situation-professionnelle-fiscale.json";
import { buildDocDefinition as buildProFiscaleDocDefinition } from "@/utils/docDefinitions/checklist-situation-professionnelle-fiscale";
</script>

<template>
  <RubriqueBase
    sectionId="pro-fiscale"
    title="Situation professionnelle & Fiscale"
    storageKey="sn-checklist-pro-fiscale"
    pdfPrefix="situation-professionnelle-fiscale"
    :formDefinition="proFiscaleFormDefinition"
    :docBuilder="buildProFiscaleDocDefinition"
  />
</template>
