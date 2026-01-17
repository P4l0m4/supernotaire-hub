<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import capaciteFormDefinition from "@/utils/formDefinition/checklist-capacite-representation.json";
import { buildDocDefinition as buildCapaciteDocDefinition } from "@/utils/docDefinitions/checklist-capacite-representation";
</script>

<template>
  <RubriqueBase
    sectionId="capacite"
    title="Capacité & Représentation"
    storageKey="sn-checklist-capacite"
    pdfPrefix="capacite-representation"
    :formDefinition="capaciteFormDefinition"
    :docBuilder="buildCapaciteDocDefinition"
    :requireAccess="true"
  />
</template>
