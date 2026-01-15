<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import prealablesFormDefinition from "@/utils/formDefinition/checklist-informations-prealables.json";
import { buildDocDefinition as buildPrealablesDocDefinition } from "@/utils/docDefinitions/checklist-informations-prealables";
</script>

<template>
  <RubriqueBase
    sectionId="prealables"
    title="Informations préalables"
    storageKey="sn-checklist-prealables"
    pdfPrefix="informations-prealables"
    :formDefinition="prealablesFormDefinition"
    :docBuilder="buildPrealablesDocDefinition"
  />
</template>
