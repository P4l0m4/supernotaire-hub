<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import origineFormDefinition from "@/utils/formDefinition/checklist-origine-propriete.json";
import { buildDocDefinition as buildOrigineDocDefinition } from "@/utils/docDefinitions/checklist-origine-propriete";
</script>

<template>
  <RubriqueBase
    sectionId="origine"
    title="Origine de propriété"
    storageKey="sn-checklist-origine"
    pdfPrefix="origine-propriete"
    :formDefinition="origineFormDefinition"
    :docBuilder="buildOrigineDocDefinition"
    :requireAccess="true"
  />
</template>
