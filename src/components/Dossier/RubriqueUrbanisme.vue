<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import urbanismeFormDefinition from "@/utils/formDefinition/checklist-urbanisme-travaux-exterieurs.json";
import { buildDocDefinition as buildUrbanismeDocDefinition } from "@/utils/docDefinitions/checklist-urbanisme-travaux-exterieurs";
</script>

<template>
  <RubriqueBase
    sectionId="urbanisme"
    title="Urbanisme & Travaux extérieurs"
    storageKey="sn-checklist-urbanisme"
    pdfPrefix="urbanisme-travaux-exterieurs"
    :formDefinition="urbanismeFormDefinition"
    :docBuilder="buildUrbanismeDocDefinition"
    :requireAccess="true"
  />
</template>
