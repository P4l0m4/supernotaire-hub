<script setup lang="ts">
import RubriqueBase from "@/components/Dossier/RubriqueBase.vue";
import coproFormDefinition from "@/utils/formDefinition/checklist-copro-structures.json";
import { buildDocDefinition as buildCoproDocDefinition } from "@/utils/docDefinitions/checklist-copro-structures";
</script>

<template>
  <RubriqueBase
    sectionId="copro"
    title="Copropriété & Structures collectives"
    storageKey="sn-checklist-copro"
    pdfPrefix="copropriete-structures"
    :formDefinition="coproFormDefinition"
    :docBuilder="buildCoproDocDefinition"
    :requireAccess="true"
  />
</template>
